import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/google-drive/callback`;

  if (error || !code) {
    console.error("Google Drive OAuth error or denied:", error);
    return NextResponse.redirect(`${baseUrl}/?gdrive_error=access_denied#books`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/?gdrive_error=missing_credentials#books`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Failed to exchange Google Drive token:", tokenData);
      return NextResponse.redirect(`${baseUrl}/?gdrive_error=token_exchange_failed#books`);
    }

    const response = NextResponse.redirect(`${baseUrl}/?gdrive_connected=true#books`);

    // Store Google Drive access token (1 hour)
    response.cookies.set("gdrive_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600,
      path: "/",
    });

    if (tokenData.refresh_token) {
      response.cookies.set("gdrive_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 24 * 60 * 60, // 60 days
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Google Drive OAuth exchange error:", err);
    return NextResponse.redirect(`${baseUrl}/?gdrive_error=server_error#books`);
  }
}
