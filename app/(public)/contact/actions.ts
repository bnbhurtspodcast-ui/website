"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { checkRateLimit, checkSpamKeywords } from "@/lib/spam-protection";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function submitContactForm(formData: FormData) {
	// Layer 1: honeypot
	const honeypot = formData.get("website_url") as string;
	if (honeypot?.trim()) redirect("/contact?success=true");

	// Layer 2: time-based token
	const token = formData.get("form_token") as string | null;
	if (token) {
		const elapsed = Date.now() - parseInt(Buffer.from(token, "base64").toString(), 10);
		if (elapsed < 3000) {
			redirect(`/contact?error=${encodeURIComponent("Please slow down and try again.")}`);
		}
	}

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const subject = formData.get("subject") as string;
	const message = formData.get("message") as string;

	// Layer 4: keyword spam check
	if (checkSpamKeywords(subject, message)) {
		redirect("/contact?success=true");
	}

	const supabase = await createClient();

	// Layer 3: rate limiting
	const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { blocked, reason } = await checkRateLimit(supabase, ip, email);
	if (blocked) {
		redirect(`/contact?error=${encodeURIComponent(reason)}`);
	}

	const { error } = await supabase.from("contact_submissions").insert({
		name,
		email,
		subject,
		status: "new",
		message,
	});

	if (error) {
		console.error("Contact form error:", error);
		redirect(
			`/contact?error=${encodeURIComponent("There is an error, will provide a fix soon")}`,
		);
	}

	await sendDiscordNotification(
		`📬 **New Contact Submission**\n**Name:** ${name}\n**Email:** ${email}\n**Subject:** ${subject}\n`,
		"inquiries",
	);

	redirect("/contact?success=true");
}
