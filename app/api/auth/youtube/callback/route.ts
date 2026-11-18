import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = host.includes("localhost")
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL || "https://life-hub-lemon-five.vercel.app");
  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

  const isUnified = state === "google_unified";
  const isGDrive = state === "gdrive";
  const errorParam = encodeURIComponent(error || "access_denied");
  const errorRedirect = isUnified
    ? `${baseUrl}/?google_error=${errorParam}#google`
    : isGDrive
    ? `${baseUrl}/?gdrive_error=${errorParam}#books`
    : `${baseUrl}/?yt_error=${errorParam}#music`;

  if (error || !code) {
    console.error("Google OAuth error or denied:", error);
    return NextResponse.redirect(errorRedirect);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const credError = isUnified
      ? `${baseUrl}/?google_error=missing_credentials#google`
      : isGDrive
      ? `${baseUrl}/?gdrive_error=missing_credentials#books`
      : `${baseUrl}/?yt_error=missing_credentials#music`;
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
      const failRedirect = isUnified
        ? `${baseUrl}/?google_error=token_exchange_failed#google`
        : isGDrive
        ? `${baseUrl}/?gdrive_error=token_exchange_failed#books`
        : `${baseUrl}/?yt_error=token_exchange_failed#music`;
      return NextResponse.redirect(failRedirect);
    }

    // Success response URL
    const successUrl = isUnified
      ? `${baseUrl}/?google_connected=true#google`
      : isGDrive
      ? `${baseUrl}/?gdrive_connected=true#books`
      : `${baseUrl}/?yt_connected=true#music`;

    const response = NextResponse.redirect(successUrl);

    // If unified login or gdrive, fetch Google User profile
    let userName = "";
    let userEmail = "";
    let userPic = "";
    try {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (userRes.ok) {
        const userInfo = await userRes.json();
        userName = userInfo.name || "";
        userEmail = userInfo.email || "";
        userPic = userInfo.picture || "";
      }
    } catch (e) {
      console.warn("Could not fetch user profile info:", e);
    }

    const cookieMaxAge = tokenData.expires_in || 3600;
    const refreshMaxAge = 60 * 24 * 60 * 60; // 60 days

    // Store user identity cookies if available
    if (userName) {
      response.cookies.set("google_user_name", userName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: refreshMaxAge,
        path: "/",
      });
    }
    if (userEmail) {
      response.cookies.set("google_user_email", userEmail, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: refreshMaxAge,
        path: "/",
      });
    }
    if (userPic) {
      response.cookies.set("google_user_picture", userPic, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: refreshMaxAge,
        path: "/",
      });
    }

    if (isUnified) {
      // Store all unified tokens across Drive, YouTube, Calendar
      const tokensToSet = [
        "google_access_token",
        "gdrive_access_token",
        "yt_access_token",
        "gcal_access_token",
      ];
      tokensToSet.forEach((key) => {
        response.cookies.set(key, tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: cookieMaxAge,
          path: "/",
        });
      });

      if (tokenData.refresh_token) {
        const refreshTokensToSet = [
          "google_refresh_token",
          "gdrive_refresh_token",
          "yt_refresh_token",
          "gcal_refresh_token",
        ];
        refreshTokensToSet.forEach((key) => {
          response.cookies.set(key, tokenData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: refreshMaxAge,
            path: "/",
          });
        });
      }
    } else if (isGDrive) {
      // Store Google Drive tokens
      response.cookies.set("gdrive_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });

      if (tokenData.refresh_token) {
        response.cookies.set("gdrive_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshMaxAge,
          path: "/",
        });
      }
    } else {
      // Store YouTube tokens
      response.cookies.set("yt_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });

      if (tokenData.refresh_token) {
        response.cookies.set("yt_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshMaxAge,
          path: "/",
        });
      }
    }

    return response;
  } catch (err) {
    console.error("OAuth exchange exception:", err);
    const serverErrRedirect = isUnified
      ? `${baseUrl}/?google_error=server_error#google`
      : isGDrive
      ? `${baseUrl}/?gdrive_error=server_error#books`
      : `${baseUrl}/?yt_error=server_error#music`;
    return NextResponse.redirect(serverErrRedirect);
  }
}
