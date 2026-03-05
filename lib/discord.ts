export async function sendDiscordNotification(content: string, type: string) {
	const webhookUrl: Record<string, string | undefined> = {
		task: process.env.DISCORD_INQUIRIES_WEBHOOK,
		inquiries: process.env.DISCORD_INQUIRIES_WEBHOOK,
		shop: process.env.DISCORD_INQUIRIES_WEBHOOK,
	};

	if (!webhookUrl[type]) return;

	try {
		await fetch(webhookUrl[type]!, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		});
	} catch (err) {
		console.error("Discord notification failed:", err);
	}
}
