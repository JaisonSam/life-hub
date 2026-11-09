import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("gdrive_access_token")?.value;
  const refreshToken = cookieStore.get("gdrive_refresh_token")?.value;

  if (accessToken) return accessToken;

  if (refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const data = await res.json();
      if (res.ok && data.access_token) {
        return data.access_token;
      }
    } catch {}
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Google Drive not authorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Google Drive download error:", errText);
      return NextResponse.json(
        { error: "Failed to download file from Google Drive" },
        { status: res.status }
      );
    }

    const arrayBuffer = await res.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": `attachment; filename="${fileId}.epub"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("Download stream error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
