import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Default to "all" for the common connection point
  const service = searchParams.get("service") || "all";

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
      { error: "Google Client ID is not configured in environment variables" },
      { status: 500 }
    );
  }

  let scopes: string[] = [];
  let state = "google_all_step1";

  if (service === "drive") {
    scopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.file",
    ];
    state = "google_drive";
  } else if (service === "youtube") {
    scopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ];
    state = "google_youtube";
  } else if (service === "calendar") {
    scopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar.readonly",
    ];
    state = "google_calendar";
  } else {
    // "all" - Common Connection Point
    // Step 1: Calendar + Drive Workspace (100% compatible in Google Workspace, zero scope conflict)
    // Upon completion, callback immediately auto-redirects to Step 2 for YouTube Music!
    scopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.file",
    ];
    state = "google_all_step1";
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&access_type=offline&prompt=consent&state=${state}`;

  return NextResponse.redirect(authUrl);
}
