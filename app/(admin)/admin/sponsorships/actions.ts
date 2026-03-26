"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
