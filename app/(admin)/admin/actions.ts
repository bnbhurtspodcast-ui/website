"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Task, KanbanColumn, CalendarEvent } from "@/types";
import { sendDiscordNotification } from "@/lib/discord";

export async function updateContactStatus(
	id: string,
	status: string,
	reviewedBy?: string,
) {
	const supabase = await createClient();
	const updates: Record<string, unknown> = {
		status,
		updated_at: new Date().toISOString(),
	};
	if (reviewedBy !== undefined) updates.reviewed_by = reviewedBy;
	await supabase.from("contact_submissions").update(updates).eq("id", id);
	revalidatePath("/admin/contacts");
}

export async function reviewContactSubmission(id: string, reviewedBy: string) {
	const supabase = await createClient();
	await supabase
		.from("contact_submissions")
		.update({
			status: "reviewed",
			reviewed_by: reviewedBy,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.eq("status", "new");
	revalidatePath("/admin/contacts");
}

export async function deleteContactSubmission(id: string) {
	const supabase = await createClient();
	await supabase.from("contact_submissions").delete().eq("id", id);
	revalidatePath("/admin/contacts");
}

export async function updateGuestStatus(
	id: string,
	status: string,
	reviewedBy?: string,
) {
	const supabase = await createClient();
	const updates: Record<string, unknown> = {
		status,
		updated_at: new Date().toISOString(),
	};
	if (reviewedBy !== undefined) updates.reviewed_by = reviewedBy;
	await supabase.from("guest_applications").update(updates).eq("id", id);
	revalidatePath("/admin/guests");
}

export async function reviewGuestApplication(id: string, reviewedBy: string) {
	const supabase = await createClient();
	await supabase
		.from("guest_applications")
		.update({
			status: "reviewing",
			reviewed_by: reviewedBy,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.eq("status", "pending");
	revalidatePath("/admin/guests");
}

export async function deleteGuestApplication(id: string) {
	const supabase = await createClient();
	await supabase.from("guest_applications").delete().eq("id", id);
	revalidatePath("/admin/guests");
}

export async function updateSponsorshipStatus(
	id: string,
	status: string,
	reviewedBy?: string,
) {
	const supabase = await createClient();
	const updates: Record<string, unknown> = {
		status,
		updated_at: new Date().toISOString(),
	};
	if (reviewedBy !== undefined) updates.reviewed_by = reviewedBy;
	await supabase.from("sponsorship_inquiries").update(updates).eq("id", id);
	revalidatePath("/admin/sponsorships");
}

export async function reviewSponsorshipInquiry(id: string, reviewedBy: string) {
	const supabase = await createClient();
	await supabase
		.from("sponsorship_inquiries")
		.update({
			status: "reviewing",
			reviewed_by: reviewedBy,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.eq("status", "new");
	revalidatePath("/admin/sponsorships");
}

export async function deleteSponsorshipInquiry(id: string) {
	const supabase = await createClient();
	await supabase.from("sponsorship_inquiries").delete().eq("id", id);
	revalidatePath("/admin/sponsorships");
}

export async function updateTaskColumn(id: string, columnId: string) {
	const supabase = await createClient();
	const [{ data: task }, { data: column }] = await Promise.all([
		supabase.from("tasks").select("title").eq("id", id).single(),
		supabase.from("kanban_columns").select("name").eq("id", columnId).single(),
	]);
	await supabase.from("tasks").update({ column_id: columnId }).eq("id", id);
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🔀 **Task Moved**\n**Task:** ${task?.title ?? id}\n**To column:** ${column?.name ?? columnId}\n`,
	);
}

export async function createTask(data: {
	title: string;
	description: string;
	column_id: string;
	priority: string;
	assignee_names?: string[];
	assignee_ids?: string[];
	due_date?: string;
	label_color?: string;
	event_id?: string;
}) {
	const supabase = await createClient();
	const { data: column } = await supabase
		.from("kanban_columns")
		.select("name")
		.eq("id", data.column_id)
		.single();
	await supabase.from("tasks").insert({
		title: data.title,
		description: data.description,
		column_id: data.column_id,
		priority: data.priority,
		assignee_names: data.assignee_names ?? [],
		assignee_ids: data.assignee_ids ?? [],
		due_date: data.due_date ?? null,
		label_color: data.label_color ?? null,
		event_id: data.event_id ?? null,
		tags: [],
		sort_order: 0,
	});
	revalidatePath("/admin/tasks");
	const assigneeStr = data.assignee_names?.join(", ");
	const lines = [
		`📋 **Task Created**`,
		`**Title:** ${data.title}`,
		`**Priority:** ${data.priority}`,
		`**Column:** ${column?.name ?? data.column_id}`,
		...(assigneeStr ? [`**Assignees:** ${assigneeStr}`] : []),
		...(data.due_date ? [`**Due:** ${data.due_date}`] : []),
	];
	await sendDiscordNotification(lines.join("\n"));
}

export async function updateTask(
	id: string,
	data: Partial<
		Pick<
			Task,
			| "title"
			| "description"
			| "priority"
			| "assignee_names"
			| "assignee_ids"
			| "due_date"
			| "label_color"
			| "column_id"
			| "tags"
		>
	>,
) {
	const supabase = await createClient();
	const { data: existing } = await supabase
		.from("tasks")
		.select("title")
		.eq("id", id)
		.single();
	await supabase.from("tasks").update(data).eq("id", id);
	revalidatePath("/admin/tasks");
	const changed = Object.keys(data).join(", ");
	await sendDiscordNotification(
		`✏️ **Task Updated**\n**Task:** ${existing?.title ?? id}\n**Fields changed:** ${changed}\n`,
	);
}

export async function deleteTask(id: string) {
	const supabase = await createClient();
	const { data: task } = await supabase
		.from("tasks")
		.select("title")
		.eq("id", id)
		.single();
	await supabase.from("tasks").delete().eq("id", id);
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🗑️ **Task Deleted**\n**Title:** ${task?.title ?? id}\n`,
	);
}

export async function archiveDoneTasks(): Promise<{ archivedCount: number }> {
	const supabase = await createClient();
	const { data: doneColumn } = await supabase
		.from("kanban_columns")
		.select("id")
		.eq("name", "Done")
		.single();
	if (!doneColumn) return { archivedCount: 0 };
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - 30);
	const { data: archived } = await supabase
		.from("tasks")
		.update({ archived_at: new Date().toISOString() })
		.eq("column_id", doneColumn.id)
		.lt("created_at", cutoff.toISOString())
		.is("archived_at", null)
		.select("id");
	revalidatePath("/admin/tasks");
	return { archivedCount: archived?.length ?? 0 };
}

export async function createColumn(data: {
	name: string;
	color: string;
	sort_order: number;
}): Promise<{ id?: string; error?: string }> {
	const supabase = await createClient();
	const { data: col, error } = await supabase
		.from("kanban_columns")
		.insert({ name: data.name, color: data.color, sort_order: data.sort_order })
		.select("id")
		.single();
	if (error) return { error: error.message };
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🗂️ **Column Created**\n**Name:** ${data.name}\n`,
	);
	return { id: col.id };
}

export async function updateColumn(
	id: string,
	data: Partial<Pick<KanbanColumn, "name" | "color" | "sort_order">>,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("kanban_columns")
		.update(data)
		.eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/tasks");
	return {};
}

export async function deleteColumn(id: string): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase.from("kanban_columns").delete().eq("id", id);
	if (error) {
		if (error.code === "23503") {
			return { error: "Column has tasks. Move or delete them first." };
		}
		return { error: error.message };
	}
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(`🗑️ **Column Deleted**\n**ID:** ${id}\n`);
	return {};
}

export async function getUsers(): Promise<{
	users?: { id: string; email: string; name: string }[];
	error?: string;
}> {
	const supabase = createAdminClient();
	const { data, error } = await supabase.auth.admin.listUsers();
	if (error) return { error: error.message };
	const users = (data.users ?? []).map((u) => ({
		id: u.id,
		email: u.email ?? "",
		name:
			(u.user_metadata?.full_name as string | undefined) ??
			(u.user_metadata?.name as string | undefined) ??
			u.email ??
			u.id,
	}));
	return { users };
}

type HostPayload = {
	name: string;
	interests: string | null;
	description: string | null;
	social_links: { platform: string; url: string }[];
	photo_url?: string;
	user_id?: string;          // only passed on create; immutable after that
	role: 'host' | 'team';
};

export async function createHost(payload: HostPayload) {
	const supabase = await createClient();
	await supabase.from("hosts").insert({
		name: payload.name,
		interests: payload.interests,
		description: payload.description,
		social_links: payload.social_links,
		photo_url: payload.photo_url ?? null,
		user_id: payload.user_id ?? null,
		role: payload.role,
		sort_order: 0,
	});
	revalidatePath("/admin/hosts");
	revalidatePath("/about");
}

export async function updateHost(id: string, payload: HostPayload) {
	const supabase = await createClient();
	const updates: Record<string, unknown> = {
		name: payload.name,
		interests: payload.interests,
		description: payload.description,
		social_links: payload.social_links,
		role: payload.role,
		updated_at: new Date().toISOString(),
	};
	if (payload.photo_url !== undefined) {
		updates.photo_url = payload.photo_url;
	}
	await supabase.from("hosts").update(updates).eq("id", id);
	revalidatePath("/admin/hosts");
	revalidatePath("/about");
}

export async function deleteHost(id: string) {
	const supabase = await createClient();
	await supabase.from("hosts").delete().eq("id", id);
	revalidatePath("/admin/hosts");
	revalidatePath("/about");
}

export async function updateEventHosts(id: string, hosts: string[]) {
	const supabase = await createClient();
	await supabase
		.from("events")
		.update({ hosts, updated_at: new Date().toISOString() })
		.eq("id", id);
	revalidatePath("/admin/calendar");
}

export async function getHosts(): Promise<{ id: string; name: string; user_id: string | null }[]> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("hosts")
		.select("id, name, user_id")
		.order("sort_order", { ascending: true });
	return (data ?? []).map((h) => ({ ...h, user_id: h.user_id ?? null }));
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

export async function changePassword(
	currentPassword: string,
	newPassword: string,
) {
	const supabase = await createClient();

	// Re-authenticate with current password to verify it
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user?.email) return { error: "Not authenticated" };

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: currentPassword,
	});
	if (signInError) return { error: "Current password is incorrect" };

	const { error } = await supabase.auth.updateUser({ password: newPassword });
	if (error) return { error: error.message };

	return { success: true };
}
