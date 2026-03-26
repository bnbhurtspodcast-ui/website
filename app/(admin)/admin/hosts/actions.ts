"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type HostPayload = {
	name: string;
	interests: string | null;
	description: string | null;
	social_links: { platform: string; url: string }[];
	photo_url?: string;
	user_id?: string;
	role: "host" | "team";
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

export async function getHosts(): Promise<
	{ id: string; name: string; user_id: string | null }[]
> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("hosts")
		.select("id, name, user_id")
		.order("sort_order", { ascending: true });
	return (data ?? []).map((h) => ({ ...h, user_id: h.user_id ?? null }));
}
