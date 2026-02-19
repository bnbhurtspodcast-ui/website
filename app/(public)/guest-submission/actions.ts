"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitGuestApplication(formData: FormData) {
	const supabase = await createClient();

	const { error } = await supabase.from("guest_applications").insert({
		name: formData.get("name") as string,
		email: formData.get("email") as string,
		phone: (formData.get("phone") as string) || null,
		expertise: formData.get("expertise") as string,
		topic_idea: formData.get("topicIdea") as string,
		bio: formData.get("bio") as string,
		social_media: (formData.get("socialMedia") as string) || null,
		availability: (formData.get("availability") as string) || null,
	});

	if (error) {
		console.error("Guest application error:", error);
		redirect(
			`/guest-submission?error=${encodeURIComponent("There is an error, will provide a fix soon")}`,
		);
	}

	redirect("/guest-submission?success=true");
}
