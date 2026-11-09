import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("yt_access_token")?.value;
  const refreshToken = cookieStore.get("yt_refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ connected: false, playlists: [] });
  }

  // If access token expired, refresh it using refresh token
  if (!accessToken && refreshToken) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (clientId && clientSecret) {
      try {
        const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          }),
        });

        const refreshData = await refreshResponse.json();
        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
        }
      } catch (e) {
        console.error("Failed to refresh token:", e);
      }
    }
  }

  if (!accessToken) {
    return NextResponse.json({ connected: false, playlists: [] });
  }

  try {
    // Fetch personal playlists from YouTube Data API
    const ytRes = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=25",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const ytData = await ytRes.json();

    if (!ytRes.ok) {
      console.error("YouTube API error:", ytData);
      return NextResponse.json({ connected: false, error: ytData.error?.message, playlists: [] });
    }

    const playlists = (ytData.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || "Untitled Playlist",
      description: item.snippet?.description || "",
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        null,
      itemCount: item.contentDetails?.itemCount || 0,
      ytMusicUrl: `https://music.youtube.com/playlist?list=${item.id}`,
    }));

    return NextResponse.json({
      connected: true,
      playlists,
    });
  } catch (err: any) {
    console.error("YouTube fetch error:", err);
    return NextResponse.json({ connected: false, error: err.message, playlists: [] });
  }
}
