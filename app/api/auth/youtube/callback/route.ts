import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

  const isGDrive = state === "gdrive";
  const errorRedirect = isGDrive
    ? `${baseUrl}/?gdrive_error=access_denied#books`
    : `${baseUrl}/?yt_error=access_denied`;

  if (error || !code) {
    console.error("Google OAuth error or denied:", error);
    return NextResponse.redirect(errorRedirect);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const credError = isGDrive
      ? `${baseUrl}/?gdrive_error=missing_credentials#books`
      : `${baseUrl}/?yt_error=missing_credentials`;
    return NextResponse.redirect(credError);
  }

  try {
    // Exchange authorization code for tokens
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
      console.error("Failed to exchange token:", tokenData);
      const failRedirect = isGDrive
        ? `${baseUrl}/?gdrive_error=token_exchange_failed#books`
        : `${baseUrl}/?yt_error=token_exchange_failed`;
      return NextResponse.redirect(failRedirect);
    }

    // Success response
    const successUrl = isGDrive
      ? `${baseUrl}/?gdrive_connected=true#books`
      : `${baseUrl}/?yt_connected=true#music`;

    const response = NextResponse.redirect(successUrl);

    if (isGDrive) {
      // Store Google Drive tokens
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
    } else {
      // Store YouTube tokens
      response.cookies.set("yt_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in || 3600,
        path: "/",
      });

      if (tokenData.refresh_token) {
        response.cookies.set("yt_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
      }
    }

    return response;
  } catch (err) {
    console.error("OAuth exchange exception:", err);
    const serverErrRedirect = isGDrive
      ? `${baseUrl}/?gdrive_error=server_error#books`
      : `${baseUrl}/?yt_error=server_error`;
    return NextResponse.redirect(serverErrRedirect);
  }
}
