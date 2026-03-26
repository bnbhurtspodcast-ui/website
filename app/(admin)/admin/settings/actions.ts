"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function changePassword(
	currentPassword: string,
	newPassword: string,
) {
	const supabase = await createClient();

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

export async function saveHighlightedEpisode(
	youtubeUrl: string,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const value = youtubeUrl.trim() || null;
	const { error } = await supabase.from("site_settings").upsert({
		key: "highlighted_youtube_url",
		value,
		updated_at: new Date().toISOString(),
	});
	if (error) return { error: error.message };
	revalidatePath("/");
	revalidatePath("/admin/content");
	return {};
}
