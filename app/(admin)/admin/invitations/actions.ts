"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInvitationStatus(
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
  await supabase.from("invitations").update(updates).eq("id", id);
  revalidatePath("/admin/invitations");
}

export async function reviewInvitation(id: string, reviewedBy: string) {
  const supabase = await createClient();
  await supabase
    .from("invitations")
    .update({
      status: "reviewed",
      reviewed_by: reviewedBy,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "new");
  revalidatePath("/admin/invitations");
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  await supabase.from("invitations").delete().eq("id", id);
  revalidatePath("/admin/invitations");
}

export async function acceptInvitation(id: string, reviewedBy: string) {
  const supabase = await createClient();
  await supabase
    .from("invitations")
    .update({
      status: "accepted",
      reviewed_by: reviewedBy,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/invitations");
  revalidatePath("/admin/calendar");
}
