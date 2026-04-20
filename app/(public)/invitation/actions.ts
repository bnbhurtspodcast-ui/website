"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { checkRateLimit, checkSpamKeywords } from "@/lib/spam-protection";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function submitInvitation(formData: FormData) {
	// Layer 1: honeypot
	const honeypot = formData.get("website_url") as string;
	if (honeypot?.trim()) redirect("/invitation?success=true");

	// Layer 2: time-based token
	const token = formData.get("form_token") as string | null;
	if (token) {
		const elapsed = Date.now() - parseInt(Buffer.from(token, "base64").toString(), 10);
		if (elapsed < 3000) {
			redirect(`/invitation?error=${encodeURIComponent("Please slow down and try again.")}`);
		}
	}

	const eventName = formData.get("event_name") as string;
	const eventDate = (formData.get("event_date") as string) || null;
	const eventType = formData.get("event_type") as string;
	const venueName = (formData.get("venue_name") as string) || null;
	const venueLocation = (formData.get("venue_location") as string) || null;
	const isFree = formData.get("is_free") === "true";
	const ticketPrice = (formData.get("ticket_price") as string) || null;
	const description = (formData.get("description") as string) || null;
	const contactName = formData.get("contact_name") as string;
	const contactEmail = formData.get("contact_email") as string;
	const contactPhone = (formData.get("contact_phone") as string) || null;
	const message = (formData.get("message") as string) || null;

	// Layer 4: keyword spam check
	if (checkSpamKeywords(eventName, description ?? "", message ?? "")) {
		redirect("/invitation?success=true");
	}

	const supabase = await createClient();

	// Layer 3: rate limiting
	const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const { blocked, reason } = await checkRateLimit(supabase, ip, contactEmail);
	if (blocked) {
		redirect(`/invitation?error=${encodeURIComponent(reason)}`);
	}

	const { error } = await supabase.from("invitations").insert({
		event_name: eventName,
		event_date: eventDate,
		event_type: eventType,
		venue_name: venueName,
		venue_location: venueLocation,
		is_free: isFree,
		ticket_price: ticketPrice,
		description,
		contact_name: contactName,
		contact_email: contactEmail,
		contact_phone: contactPhone,
		message,
		status: "new",
	});

	if (error) {
		console.error("Invitation submission error:", error);
		redirect(
			`/invitation?error=${encodeURIComponent("There is an error, will provide a fix soon")}`,
		);
	}

	const admissionLine = isFree ? "Free" : `Paid${ticketPrice ? ` — ${ticketPrice}` : ""}`;
	await sendDiscordNotification(
		`🎪 **New Show Invitation**\n**Event:** ${eventName}\n**Date:** ${eventDate ?? "TBD"}\n**Venue:** ${venueName ?? "TBD"}\n**Type:** ${eventType}\n**Admission:** ${admissionLine}\n**From:** ${contactName} <${contactEmail}>`,
		"inquiries",
	);

	redirect("/invitation?success=true");
}
