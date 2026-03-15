"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { checkRateLimit, checkSpamKeywords } from "@/lib/spam-protection";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function submitGuestApplication(formData: FormData) {
	// Layer 1: honeypot
	const honeypot = formData.get("website_url") as string;
	if (honeypot?.trim()) redirect("/guest-submission?success=true");

	// Layer 2: time-based token
	const token = formData.get("form_token") as string | null;
	if (token) {
		const elapsed = Date.now() - parseInt(Buffer.from(token, "base64").toString(), 10);
		if (elapsed < 3000) {
			redirect(`/guest-submission?error=${encodeURIComponent("Please slow down and try again.")}`);
		}
	}

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const expertise = formData.get("expertise") as string;
	const topicIdea = formData.get("topicIdea") as string;
	const bio = formData.get("bio") as string;

	// Layer 4: keyword spam check
	if (checkSpamKeywords(expertise, topicIdea, bio)) {
		redirect("/guest-submission?success=true");
	}

	const supabase = await createClient();

	// Layer 3: rate limiting
	const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { blocked, reason } = await checkRateLimit(supabase, ip, email);
	if (blocked) {
		redirect(`/guest-submission?error=${encodeURIComponent(reason)}`);
	}

	const { error } = await supabase.from("guest_applications").insert({
		name,
		email,
		phone: (formData.get("phone") as string) || null,
		expertise,
		topic_idea: topicIdea,
		bio,
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
		"inquiries",
	);

	redirect("/guest-submission?success=true");
}
