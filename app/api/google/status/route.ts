import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const googleToken = cookieStore.get("google_access_token")?.value;
  const gdriveToken = cookieStore.get("gdrive_access_token")?.value || googleToken;
  const ytToken = cookieStore.get("yt_access_token")?.value || googleToken;
  const gcalToken = cookieStore.get("gcal_access_token")?.value || googleToken;

  const userName = cookieStore.get("google_user_name")?.value || null;
  const userEmail = cookieStore.get("google_user_email")?.value || null;
  const userPicture = cookieStore.get("google_user_picture")?.value || null;

  const isConnected = !!(googleToken || gdriveToken || ytToken || gcalToken);

  return NextResponse.json({
    connected: isConnected,
    user: {
      name: userName || (isConnected ? "Jaison Shanmugiah" : null),
      email: userEmail || (isConnected ? "Connected Google Account" : null),
      picture: userPicture,
    },
    services: {
      calendar: {
        connected: !!gcalToken,
        name: "Google Calendar",
        description: "Live schedule, meetings & agenda",
      },
      drive: {
        connected: !!gdriveToken,
        name: "Google Drive",
        description: "Cloud docs, sheets & Kobo eReader shelf",
      },
      youtube: {
        connected: !!ytToken,
        name: "YouTube Music",
        description: "Personal playlists, soundscapes & albums",
      },
      workspace: {
        connected: isConnected,
        name: "Google Workspace",
        description: "Gmail, Meet, Docs, Sheets & Keep",
      },
    },
    syncedAt: new Date().toISOString(),
  });
}
