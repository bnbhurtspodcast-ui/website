"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type {
	CalendarEvent,
	EventType,
	EventReview,
	RecordingSessionTask,
	EdmtrainEvent,
	EdmtrainApiResponse,
	EdmtrainLocationSuggestion,
	EdmtrainAutocompleteLocationResponse,
} from "@/types";

type EventUpsertData = {
	name: string;
	event_type: EventType;
	event_date: string;
	start_time?: string | null;
	end_time?: string | null;
	venue_name?: string | null;
	venue_location?: string | null;
	venue_address?: string | null;
	description?: string | null;
	link?: string | null;
	ages?: string | null;
	hosts?: string[];
	notes?: string | null;
	edmtrain_id?: number | null;
};

export async function createEvent(
	data: EventUpsertData,
): Promise<{ event?: CalendarEvent; error?: string }> {
	const supabase = await createClient();
	const { data: row, error } = await supabase
		.from("events")
		.insert({
			...data,
			festival_ind: data.event_type === "festival",
			livestream_ind: data.event_type === "livestream",
			hosts: data.hosts ?? [],
			artists: [],
		})
		.select("*")
		.single();
	if (error) return { error: error.message };
	revalidatePath("/admin/calendar");

	const { data: eventsCol } = await supabase
		.from("kanban_columns")
		.select("id")
		.ilike("name", "events")
		.maybeSingle();
	if (eventsCol) {
		const hostIds = data.hosts ?? [];
		let assignee_names: string[] = [];
		let assignee_ids: string[] = [];
		if (hostIds.length > 0) {
			const { data: hostRows } = await supabase
				.from("hosts")
				.select("id, name, user_id")
				.in("id", hostIds);
			if (hostRows) {
				assignee_names = hostRows.map((h) => h.name as string);
				assignee_ids = hostRows.map((h) => (h.user_id ?? h.id) as string);
			}
		}
		await supabase.from("tasks").insert({
			title: data.name,
			description: `Event on ${data.event_date}${data.venue_name ? ` at ${data.venue_name}` : ""}`,
			column_id: eventsCol.id,
			priority: "medium",
			event_id: row.id,
			assignee_names,
			assignee_ids,
			tags: [],
			sort_order: 0,
		});
		revalidatePath("/admin/tasks");
	}

	return { event: row as CalendarEvent };
}

export async function updateEvent(
	id: string,
	data: Partial<EventUpsertData>,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const patch: Record<string, unknown> = {
		...data,
		updated_at: new Date().toISOString(),
	};
	if (data.event_type !== undefined) {
		patch.festival_ind = data.event_type === "festival";
		patch.livestream_ind = data.event_type === "livestream";
	}
	const { error } = await supabase.from("events").update(patch).eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/calendar");
	return {};
}

export async function getEvents(
	query: string,
): Promise<
	Pick<CalendarEvent, "id" | "name" | "event_date" | "venue_name" | "hosts">[]
> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("events")
		.select("id, name, event_date, venue_name, hosts")
		.ilike("name", `%${query}%`)
		.order("event_date", { ascending: false })
		.limit(20);
	return data ?? [];
}

type ReviewUpsertData = {
	event_id: string;
	sound: number;
	production: number;
	vibes: number;
	venue: number;
	cost: number;
	description?: string | null;
	will_go_again: boolean;
};

export async function createEventReview(
	data: ReviewUpsertData,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { error: "Not authenticated" };

	const { error } = await supabase.from("event_reviews").upsert(
		{ ...data, reviewer_id: user.id, updated_at: new Date().toISOString() },
		{
			onConflict: "event_id,reviewer_id",
		},
	);
	if (error) return { error: error.message };

	await supabase
		.from("events")
		.update({ reviewed: true, updated_at: new Date().toISOString() })
		.eq("id", data.event_id);

	revalidatePath("/admin/calendar");
	return {};
}

export async function deleteEventReview(
	id: string,
	eventId: string,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase.from("event_reviews").delete().eq("id", id);
	if (error) return { error: error.message };

	const { count } = await supabase
		.from("event_reviews")
		.select("id", { count: "exact", head: true })
		.eq("event_id", eventId);
	if (count === 0) {
		await supabase
			.from("events")
			.update({ reviewed: false, updated_at: new Date().toISOString() })
			.eq("id", eventId);
	}

	revalidatePath("/admin/calendar");
	return {};
}

export async function getEventReviews(eventId: string): Promise<EventReview[]> {
	const adminClient = createAdminClient();
	const { data } = await adminClient
		.from("event_reviews")
		.select("*")
		.eq("event_id", eventId)
		.order("created_at", { ascending: true });

	if (!data || data.length === 0) return [];

	const {
		data: { users },
	} = await adminClient.auth.admin.listUsers();
	const userMap = new Map(
		(users ?? []).map((u) => [
			u.id,
			(u.user_metadata?.name as string | undefined) ?? u.email ?? u.id,
		]),
	);

	return data.map((r) => ({
		id: r.id as string,
		event_id: r.event_id as string,
		reviewer_id: r.reviewer_id as string,
		reviewer_name: userMap.get(r.reviewer_id as string),
		sound: r.sound as number,
		production: r.production as number,
		vibes: r.vibes as number,
		venue: r.venue as number,
		cost: (r.cost ?? 0) as number,
		description: r.description as string | null,
		will_go_again: r.will_go_again as boolean,
		created_at: r.created_at as string,
		updated_at: r.updated_at as string,
	}));
}

export async function getRecordingSessionTasksForDateRange(
	from: string,
	to: string,
): Promise<RecordingSessionTask[]> {
	const supabase = await createClient();

	const { data: col } = await supabase
		.from("kanban_columns")
		.select("id")
		.ilike("name", "recording session")
		.maybeSingle();

	if (!col) return [];

	const { data } = await supabase
		.from("tasks")
		.select("id, title, due_date, event_id, assignee_names")
		.eq("column_id", col.id)
		.gte("due_date", from)
		.lte("due_date", to)
		.is("archived_at", null)
		.order("due_date", { ascending: true });

	return (data ?? []).map((t) => ({
		id: t.id as string,
		title: t.title as string,
		due_date: t.due_date as string,
		event_id: t.event_id as string | null,
		assignee_names: (t.assignee_names as string[]) ?? [],
	}));
}

export async function searchEdmtrainByName(
	eventName: string,
): Promise<{ events?: EdmtrainEvent[]; error?: string }> {
	const key = process.env.EDMTRAIN_API_KEY;
	if (!key) return { error: "EDMTrain API key not configured" };
	try {
		const url = `https://edmtrain.com/api/events?eventName=${encodeURIComponent(eventName)}&client=${key}`;
		console.log(url);
		const res = await fetch(url, { next: { revalidate: 0 } });
		if (!res.ok) return { error: `EDMTrain API error: ${res.status}` };
		const json = (await res.json()) as EdmtrainApiResponse;
		if (!json.success) return { error: "EDMTrain search failed" };
		return { events: json.data };
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Network error" };
	}
}

export async function searchEdmtrainLocations(
	city: string,
): Promise<{ suggestions?: EdmtrainLocationSuggestion[]; error?: string }> {
	const key = process.env.EDMTRAIN_API_KEY;
	if (!key) return { error: "EDMTrain API key not configured" };
	try {
		const params = new URLSearchParams({ query: city, client: key });
		const res = await fetch(
			`https://edmtrain.com/autocomplete/location?${params}`,
			{ next: { revalidate: 0 } },
		);
		if (!res.ok)
			return { error: `EDMTrain locations API error: ${res.status}` };
		const json = (await res.json()) as EdmtrainAutocompleteLocationResponse;
		if (!Array.isArray(json.suggestions))
			return { error: "Unexpected response from EDMTrain" };
		return { suggestions: json.suggestions };
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Network error" };
	}
}

export async function searchEdmtrainByLocationId(
	locationId: number,
): Promise<{ events?: EdmtrainEvent[]; error?: string }> {
	const key = process.env.EDMTRAIN_API_KEY;
	if (!key) return { error: "EDMTrain API key not configured" };
	try {
		const res = await fetch(
			`https://edmtrain.com/api/events?locationIds=${locationId}&client=${key}`,
			{ next: { revalidate: 0 } },
		);
		if (!res.ok) return { error: `EDMTrain events API error: ${res.status}` };
		const json = (await res.json()) as EdmtrainApiResponse;
		if (!json.success) return { error: "EDMTrain search failed" };
		return { events: json.data };
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Network error" };
	}
}
