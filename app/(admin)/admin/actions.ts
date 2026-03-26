"use server";

import { createAdminClient } from "@/lib/supabase/admin";

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
