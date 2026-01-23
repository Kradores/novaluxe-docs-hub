const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GMAIL_OAUTH_CLIENT_ID")!,
      client_secret: Deno.env.get("GMAIL_OAUTH_CLIENT_SECRET")!,
      refresh_token: Deno.env.get("GMAIL_OAUTH_REFRESH_TOKEN")!,
      grant_type: "refresh_token",
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error("Failed to refresh Gmail token");
  }

  const data = JSON.parse(text);

  if (!data.access_token) {
    throw new Error("No access token returned");
  }

  return data.access_token;
}

const base64UrlEncode = (str: string) =>
  btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export async function sendInviteEmail(to: string) {
  const accessToken = await getAccessToken();
  const sender = Deno.env.get("GMAIL_SENDER")!;
  const inviteUrl = `${Deno.env.get("SITE_URL")}/login`;

  const rawMessage = [
    `From: ${sender}`,
    `To: ${to}`,
    "Subject: You are invited",
    "",
    `Accept invitation:`,
    inviteUrl,
  ].join("\n");

  const raw = base64UrlEncode(rawMessage);

  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    throw new Error("Gmail send failed");
  }
}
