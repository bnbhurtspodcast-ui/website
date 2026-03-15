import type { SupabaseClient } from "@supabase/supabase-js";

const IP_LIMIT_PER_HOUR = 3;
const EMAIL_LIMIT_PER_DAY = 2;

export async function checkRateLimit(
  supabase: SupabaseClient,
  ip: string,
  email: string
): Promise<{ blocked: boolean; reason: string }> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  if (ip !== "unknown") {
    const { count: ipCount } = await supabase
      .from("submission_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", oneHourAgo);

    if ((ipCount ?? 0) >= IP_LIMIT_PER_HOUR) {
      return { blocked: true, reason: "Too many submissions from your network. Please try again later." };
    }
  }

  const { count: emailCount } = await supabase
    .from("submission_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("email", email.toLowerCase())
    .gte("created_at", oneDayAgo);

  if ((emailCount ?? 0) >= EMAIL_LIMIT_PER_DAY) {
    return { blocked: true, reason: "Too many submissions from this email. Please try again tomorrow." };
  }

  await supabase.from("submission_rate_limits").insert({ ip, email: email.toLowerCase() });

  return { blocked: false, reason: "" };
}

const SPAM_KEYWORDS = [
  "seo services",
  "buy followers",
  "crypto investment",
  "make money fast",
  "unsecured loan",
  "weight loss",
  "free bitcoin",
  "casino",
  "click here to",
  "earn money online",
  "work from home opportunity",
  "guaranteed income",
];

export function checkSpamKeywords(...texts: string[]): boolean {
  const combined = texts.join(" ").toLowerCase();
  const hits = SPAM_KEYWORDS.filter((kw) => combined.includes(kw));
  return hits.length >= 2;
}
