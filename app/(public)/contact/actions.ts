"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import { redirect } from "next/navigation";

export async function submitContactForm(formData: FormData) {
	const supabase = await createClient();

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const subject = formData.get("subject") as string;
	const message = formData.get("message") as string;

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
	);

	redirect("/contact?success=true");
}
