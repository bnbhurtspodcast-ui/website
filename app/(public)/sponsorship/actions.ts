"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { redirect } from "next/navigation";

export async function submitSponsorshipInquiry(formData: FormData) {
	const supabase = await createClient();

	const companyName = formData.get("companyName") as string;
	const contactName = formData.get("contactName") as string;
	const email = formData.get("email") as string;
	const budget = (formData.get("budget") as string) || null;

	const { error } = await supabase.from("sponsorship_inquiries").insert({
		company_name: companyName,
		contact_name: contactName,
		email,
		phone: (formData.get("phone") as string) || null,
		website: (formData.get("website") as string) || null,
		budget,
		goals: formData.get("goals") as string,
		message: (formData.get("message") as string) || null,
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
