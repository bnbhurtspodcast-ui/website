"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
