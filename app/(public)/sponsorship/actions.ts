"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { checkRateLimit, checkSpamKeywords } from "@/lib/spam-protection";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function submitSponsorshipInquiry(formData: FormData) {
	// Layer 1: honeypot
	const honeypot = formData.get("website_url") as string;
	if (honeypot?.trim()) redirect("/sponsorship?success=true");

	// Layer 2: time-based token
	const token = formData.get("form_token") as string | null;
	if (token) {
		const elapsed = Date.now() - parseInt(Buffer.from(token, "base64").toString(), 10);
		if (elapsed < 3000) {
			redirect(`/sponsorship?error=${encodeURIComponent("Please slow down and try again.")}`);
		}
	}

	const companyName = formData.get("companyName") as string;
	const contactName = formData.get("contactName") as string;
	const email = formData.get("email") as string;
	const budget = (formData.get("budget") as string) || null;
	const goals = formData.get("goals") as string;
	const message = (formData.get("message") as string) || null;

	// Layer 4: keyword spam check
	if (checkSpamKeywords(goals, message ?? "")) {
		redirect("/sponsorship?success=true");
	}

	const supabase = await createClient();

	// Layer 3: rate limiting
	const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { blocked, reason } = await checkRateLimit(supabase, ip, email);
	if (blocked) {
		redirect(`/sponsorship?error=${encodeURIComponent(reason)}`);
	}

	const { error } = await supabase.from("sponsorship_inquiries").insert({
		company_name: companyName,
		contact_name: contactName,
		email,
		phone: (formData.get("phone") as string) || null,
		website: (formData.get("website") as string) || null,
		budget,
		goals,
		message,
	});

	if (error) {
		console.error("Sponsorship inquiry error:", error);
		redirect(
			`/sponsorship?error=${encodeURIComponent("There is an error, will provide a fix soon")}`,
		);
	}

	await sendDiscordNotification(
		`💼 **New Sponsorship Inquiry**\n**Company:** ${companyName}\n**Contact:** ${contactName}\n**Email:** ${email}\n**Budget:** ${budget ?? "not specified"}\n`,
		"inquiries",
	);

	redirect("/sponsorship?success=true");
}
