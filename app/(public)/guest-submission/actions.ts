"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { redirect } from "next/navigation";

export async function submitGuestApplication(formData: FormData) {
	const supabase = await createClient();

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const expertise = formData.get("expertise") as string;
	const topicIdea = formData.get("topicIdea") as string;

	const { error } = await supabase.from("guest_applications").insert({
		name,
		email,
		phone: (formData.get("phone") as string) || null,
		expertise,
		topic_idea: topicIdea,
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

	await sendDiscordNotification(
		`🎙️ **New Guest Application**\n**Name:** ${name}\n**Email:** ${email}\n**Expertise:** ${expertise}\n**Topic:** ${topicIdea}\n`,
	);

	redirect("/guest-submission?success=true");
}
