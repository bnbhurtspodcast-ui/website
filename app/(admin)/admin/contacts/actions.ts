"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
