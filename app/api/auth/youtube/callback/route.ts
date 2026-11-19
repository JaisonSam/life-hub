import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state") || "google_all_step1";

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = host.includes("localhost")
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL || "https://life-hub-lemon-five.vercel.app");
  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

  const isChainStep1 = state === "google_all_step1";
  const isChainStep2 = state === "google_all_step2";
  const isDrive = state === "gdrive" || state === "google_drive";
  const isYouTube = state === "youtube" || state === "google_youtube" || isChainStep2;
  const isCalendar = state === "google_calendar" || state === "google_unified";

  // If user declined or cancelled during Step 2 of the chain, preserve Step 1 (Workspace)
  if ((error || !code) && isChainStep2) {
    console.warn("YouTube permission skipped or denied in Step 2 of chain:", error);
    return NextResponse.redirect(`${baseUrl}/?google_connected=workspace_only&google_warning=youtube_skipped#google`);
  }

  const errorParam = encodeURIComponent(error || "access_denied");
  const errorRedirect = isDrive
    ? `${baseUrl}/?google_error=${errorParam}&service=drive#google`
    : isYouTube
    ? `${baseUrl}/?google_error=${errorParam}&service=youtube#google`
    : `${baseUrl}/?google_error=${errorParam}&service=calendar#google`;

  if (error || !code) {
    console.error("Google OAuth error or denied:", error);
    return NextResponse.redirect(errorRedirect);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/?google_error=missing_credentials#google`);
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
      return NextResponse.redirect(`${baseUrl}/?google_error=token_exchange_failed#google`);
    }

    // Fetch user profile info
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

    // STEP 1 OF 2-STEP CHAIN: CALENDAR + DRIVE TOKENS SAVED -> AUTO-FORWARD TO YOUTUBE
    if (isChainStep1) {
      const ytScope = encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly");
      const step2AuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${ytScope}&access_type=offline&prompt=consent&state=google_all_step2`;

      const response = NextResponse.redirect(step2AuthUrl);

      // Save User Identity
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

      // Save Calendar Tokens
      response.cookies.set("gcal_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });
      response.cookies.set("google_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });

      // Save Google Drive Tokens
      response.cookies.set("gdrive_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });

      if (tokenData.refresh_token) {
        response.cookies.set("gcal_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshMaxAge,
          path: "/",
        });
        response.cookies.set("google_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshMaxAge,
          path: "/",
        });
        response.cookies.set("gdrive_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshMaxAge,
          path: "/",
        });
      }

      return response;
    }

    // STEP 2 OF 2-STEP CHAIN: YOUTUBE MUSIC TOKEN SAVED -> REDIRECT TO HOME WITH ALL CONNECTED
    if (isChainStep2) {
      const response = NextResponse.redirect(`${baseUrl}/?google_connected=all#google`);

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

      return response;
    }

    // INDIVIDUAL SERVICE CONNECTION (Drive, YouTube, or Calendar individually)
    const connectedService = isDrive ? "drive" : isYouTube ? "youtube" : "calendar";
    const successUrl = `${baseUrl}/?google_connected=${connectedService}#google`;
    const response = NextResponse.redirect(successUrl);

    // Store user identity cookies
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

    // Save tokens based on service state
    if (isDrive) {
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
    } else if (isYouTube) {
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
    } else {
      // Calendar & General Google session
      response.cookies.set("gcal_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });
      response.cookies.set("google_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });
      if (tokenData.refresh_token) {
        response.cookies.set("gcal_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshMaxAge,
          path: "/",
        });
        response.cookies.set("google_refresh_token", tokenData.refresh_token, {
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
    return NextResponse.redirect(`${baseUrl}/?google_error=server_error#google`);
  }
}
