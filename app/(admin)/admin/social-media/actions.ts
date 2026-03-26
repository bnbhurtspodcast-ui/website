"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { SocialPost, SocialPostStatus, SocialPlatform, SocialPostType, PlatformSettings, SocialToken, OAuthPlatform } from "@/types";
import { buildYouTubeAuthUrl, buildTikTokAuthUrl, buildMetaAuthUrl, buildThreadsAuthUrl, generateState, generatePKCE } from "@/lib/oauth";

type SocialPostInsert = {
	title?: string | null
	description: string
	post_type: SocialPostType
	scheduled_at: string
	status: SocialPostStatus
	platforms: SocialPlatform[]
	media_paths?: string[] | null
	platform_settings: PlatformSettings
}

export async function createSocialPost(
	data: SocialPostInsert,
): Promise<{ id?: string; error?: string }> {
	const supabase = await createClient();
	const { data: row, error } = await supabase
		.from("social_posts")
		.insert(data)
		.select("id")
		.single();
	if (error) return { error: error.message };
	revalidatePath("/admin/social-media");
	revalidatePath("/admin/calendar");
	return { id: row.id };
}

export async function updateSocialPost(
	id: string,
	data: Partial<SocialPostInsert>,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("social_posts")
		.update({ ...data, updated_at: new Date().toISOString() })
		.eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/social-media");
	revalidatePath("/admin/calendar");
	return {};
}

export async function deleteSocialPost(
	id: string,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { data: post } = await supabase
		.from("social_posts")
		.select("media_paths")
		.eq("id", id)
		.single();
	if (post?.media_paths && post.media_paths.length > 0) {
		await supabase.storage.from("social-media-uploads").remove(post.media_paths);
	}
	const { error } = await supabase.from("social_posts").delete().eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/social-media");
	revalidatePath("/admin/calendar");
	return {};
}

export async function markPostAsPosted(
	id: string,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { data: post } = await supabase
		.from("social_posts")
		.select("media_paths")
		.eq("id", id)
		.single();
	if (post?.media_paths && post.media_paths.length > 0) {
		await supabase.storage.from("social-media-uploads").remove(post.media_paths);
	}
	const { error } = await supabase
		.from("social_posts")
		.update({ status: "posted", media_paths: null, updated_at: new Date().toISOString() })
		.eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/social-media");
	revalidatePath("/admin/calendar");
	return {};
}

export async function getSocialPostsForDateRange(
	from: string,
	to: string,
): Promise<SocialPost[]> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("social_posts")
		.select("*")
		.gte("scheduled_at", from + "T00:00:00Z")
		.lte("scheduled_at", to + "T23:59:59Z")
		.in("status", ["scheduled", "posted"])
		.order("scheduled_at", { ascending: true });
	return (data as SocialPost[]) ?? [];
}

export async function getSocialTokens(): Promise<SocialToken[]> {
	const supabase = await createClient();
	const { data } = await supabase.from("social_tokens").select("*").order("platform");
	return (data as SocialToken[]) ?? [];
}

export async function disconnectSocialPlatform(platform: OAuthPlatform): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase.from("social_tokens").delete().eq("platform", platform);
	if (error) return { error: error.message };
	revalidatePath("/admin/social-media");
	return {};
}

const OAUTH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	maxAge: 300,
	path: "/",
};

export async function getYouTubeOAuthUrl(returnTo: "admin" | "demo" = "admin"): Promise<{ url: string }> {
	const state = generateState();
	const cookieStore = await cookies();
	cookieStore.set("oauth_state", state, OAUTH_COOKIE_OPTIONS);
	cookieStore.set("oauth_return", returnTo, OAUTH_COOKIE_OPTIONS);
	return { url: buildYouTubeAuthUrl(state) };
}

export async function getTikTokOAuthUrl(returnTo: "admin" | "demo" = "admin"): Promise<{ url: string }> {
	const state = generateState();
	const { verifier, challenge } = generatePKCE();
	const cookieStore = await cookies();
	cookieStore.set("oauth_state", state, OAUTH_COOKIE_OPTIONS);
	cookieStore.set("oauth_code_verifier", verifier, OAUTH_COOKIE_OPTIONS);
	cookieStore.set("oauth_return", returnTo, OAUTH_COOKIE_OPTIONS);
	return { url: buildTikTokAuthUrl(state, challenge) };
}

export async function getMetaOAuthUrl(returnTo: "admin" | "demo" = "admin"): Promise<{ url: string }> {
	const state = generateState();
	const cookieStore = await cookies();
	cookieStore.set("oauth_state", state, OAUTH_COOKIE_OPTIONS);
	cookieStore.set("oauth_return", returnTo, OAUTH_COOKIE_OPTIONS);
	return { url: buildMetaAuthUrl(state) };
}

export async function getThreadsOAuthUrl(returnTo: "admin" | "demo" = "admin"): Promise<{ url: string }> {
	const state = generateState();
	const cookieStore = await cookies();
	cookieStore.set("oauth_state", state, OAUTH_COOKIE_OPTIONS);
	cookieStore.set("oauth_return", returnTo, OAUTH_COOKIE_OPTIONS);
	return { url: buildThreadsAuthUrl(state) };
}
