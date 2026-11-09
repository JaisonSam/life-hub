import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("user") || process.env.LASTFM_USERNAME;
  const apiKey = searchParams.get("apiKey") || process.env.LASTFM_API_KEY;

  if (!username || !apiKey) {
    return NextResponse.json({
      configured: false,
      nowPlaying: false,
      message: "Last.fm username and API key required for live Android mirroring",
    });
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      username
    )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=2`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "LifeHub/1.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        configured: true,
        nowPlaying: false,
        error: `Last.fm API returned ${res.status}: ${errText}`,
      });
    }

    const data = await res.json();
    const tracks = data?.recenttracks?.track;

    if (!tracks || tracks.length === 0) {
      return NextResponse.json({
        configured: true,
        nowPlaying: false,
        message: "No recent tracks found for this user",
      });
    }

    const currentTrack = Array.isArray(tracks) ? tracks[0] : tracks;
    const isNowPlaying = currentTrack["@attr"]?.nowplaying === "true";

    const title = currentTrack.name || "Unknown Track";
    const artist =
      typeof currentTrack.artist === "object"
        ? currentTrack.artist["#text"] || currentTrack.artist.name
        : currentTrack.artist || "Unknown Artist";
    const album =
      typeof currentTrack.album === "object"
        ? currentTrack.album["#text"] || currentTrack.album.name
        : currentTrack.album || "";

    // Extract best album image
    let albumArt = "";
    if (Array.isArray(currentTrack.image)) {
      const extraLarge = currentTrack.image.find((i: any) => i.size === "extralarge");
      const large = currentTrack.image.find((i: any) => i.size === "large");
      albumArt = extraLarge?.["#text"] || large?.["#text"] || currentTrack.image[0]?.["#text"] || "";
    }

    // Direct YouTube Music Search URL for this track
    const ytMusicUrl = `https://music.youtube.com/search?q=${encodeURIComponent(
      `${title} ${artist}`
    )}`;

    const playedAt = isNowPlaying
      ? "Playing right now"
      : currentTrack.date?.["#text"]
      ? `Played ${currentTrack.date["#text"]}`
      : "Recently played";

    return NextResponse.json({
      configured: true,
      nowPlaying: isNowPlaying,
      title,
      artist,
      album,
      albumArt,
      ytMusicUrl,
      playedAt,
      lastFmUrl: currentTrack.url || "",
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: true,
      nowPlaying: false,
      error: error.message || "Failed to fetch live track from Last.fm",
    });
  }
}
