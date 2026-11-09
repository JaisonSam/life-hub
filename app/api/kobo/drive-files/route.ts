import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("gdrive_access_token")?.value;
  const refreshToken = cookieStore.get("gdrive_refresh_token")?.value;

  if (accessToken) return accessToken;

  // Attempt refresh if refresh token is available
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
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  return null;
}

export async function GET() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    return NextResponse.json({
      connected: false,
      folderFound: false,
      files: [],
      message: "Google Drive is not connected.",
    });
  }

  try {
    // 1. Search for Kobo eReader folder
    const folderQuery = encodeURIComponent(
      "name = 'Kobo eReader' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    );
    const folderRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id,name)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const folderData = await folderRes.json();
    const koboFolder = folderData.files?.[0];

    // 2. Query EPUB files
    let fileQuery = "(name contains '.epub' or mimeType = 'application/epub+zip') and trashed = false";
    if (koboFolder?.id) {
      // Prioritize files in Kobo eReader folder or matching .epub
      fileQuery = `('${koboFolder.id}' in parents or name contains '.epub') and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
    }

    const filesRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        fileQuery
      )}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,thumbnailLink)&pageSize=100&orderBy=modifiedTime desc`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const filesData = await filesRes.json();

    if (!filesRes.ok) {
      console.error("Google Drive API error:", filesData);
      const errMsg = filesData.error?.message || "Failed to list Drive files";
      const needsEnable = errMsg.includes("has not been used") || errMsg.includes("disabled");
      return NextResponse.json({
        connected: true,
        error: errMsg,
        needsApiEnable: needsEnable,
        apiEnableUrl: "https://console.cloud.google.com/apis/library/drive.googleapis.com",
        files: [],
      });
    }

    return NextResponse.json({
      connected: true,
      folderFound: !!koboFolder,
      folderId: koboFolder?.id || null,
      folderName: koboFolder?.name || "Kobo eReader",
      files: (filesData.files || []).map((f: any) => ({
        id: f.id,
        name: f.name.replace(/\.epub$/i, ""),
        fullName: f.name,
        size: f.size ? `${(parseInt(f.size) / (1024 * 1024)).toFixed(1)} MB` : "Unknown",
        modifiedTime: f.modifiedTime,
        webViewLink: f.webViewLink,
        downloadUrl: `/api/kobo/download/${f.id}`,
      })),
    });
  } catch (err: any) {
    console.error("Error fetching Google Drive files:", err);
    return NextResponse.json(
      { connected: true, error: err.message, files: [] },
      { status: 500 }
    );
  }
}
