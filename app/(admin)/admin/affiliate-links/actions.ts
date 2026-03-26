"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AffiliateLink } from "@/types";

type AffiliateLinkPayload = {
	name: string;
	description: string;
	image_url: string;
	type: "link" | "code";
	value: string;
	tracking_url: string | null;
	terms: string | null;
	website_link: string | null;
	expires_at: string | null;
	is_active: boolean;
};

export async function createAffiliateLink(
	data: AffiliateLinkPayload,
): Promise<{ error?: string; link?: AffiliateLink }> {
	const supabase = await createClient();
	const { data: link, error } = await supabase
		.from("affiliate_links")
		.insert({ ...data, expires_at: data.expires_at || null })
		.select()
		.single();
	if (error) return { error: error.message };
	revalidatePath("/admin/affiliate-links");
	revalidatePath("/");
	return { link };
}

export async function updateAffiliateLink(
	id: string,
	data: AffiliateLinkPayload,
): Promise<{ error?: string; link?: AffiliateLink }> {
	const supabase = await createClient();
	const { data: link, error } = await supabase
		.from("affiliate_links")
		.update({ ...data, expires_at: data.expires_at || null, updated_at: new Date().toISOString() })
		.eq("id", id)
		.select()
		.single();
	if (error) return { error: error.message };
	revalidatePath("/admin/affiliate-links");
	revalidatePath("/");
	return { link };
}

export async function deleteAffiliateLink(
	id: string,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("affiliate_links")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/affiliate-links");
	revalidatePath("/");
	return {};
}

export async function toggleAffiliateLinkActive(
	id: string,
	is_active: boolean,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("affiliate_links")
		.update({ is_active, updated_at: new Date().toISOString() })
		.eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/affiliate-links");
	revalidatePath("/");
	return {};
}
