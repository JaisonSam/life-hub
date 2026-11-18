import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  
  // Use canonical NEXT_PUBLIC_APP_URL for production deployments to match Google Cloud Console whitelist
  const baseUrl = host.includes("localhost")
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL || "https://life-hub-lemon-five.vercel.app");
  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Google Client ID is not configured" },
      { status: 500 }
    );
  }

  // Scopes for YouTube ONLY (Independent connection point, zero conflict with Drive)
  const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=google_youtube`;

  return NextResponse.redirect(authUrl);
}
