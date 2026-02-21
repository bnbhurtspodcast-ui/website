export async function sendDiscordNotification(content: string) {
	const webhookUrl = process.env.DISCORD_INQUIRIES_WEBHOOK;
	if (!webhookUrl) return;

	try {
		await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		});
	} catch (err) {
		console.error("Discord notification failed:", err);
	}
}
