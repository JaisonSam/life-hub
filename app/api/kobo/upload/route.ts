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

export async function POST(request: Request) {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Google Drive is not connected" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Locate or create 'Kobo eReader' folder
    let folderId: string | null = null;
    const folderRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        "name = 'Kobo eReader' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
      )}&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const folderData = await folderRes.json();
    if (folderData.files && folderData.files.length > 0) {
      folderId = folderData.files[0].id;
    } else {
      // Create folder
      const createFolderRes = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Kobo eReader",
          mimeType: "application/vnd.google-apps.folder",
        }),
      });
      const createdFolder = await createFolderRes.json();
      folderId = createdFolder.id;
    }

    // 2. Upload EPUB to Google Drive folder using multipart upload
    const metadata = {
      name: file.name,
      mimeType: "application/epub+zip",
      parents: folderId ? [folderId] : [],
    };

    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const fileBuffer = await file.arrayBuffer();

    const multipartRequestBody = Buffer.concat([
      Buffer.from(
        delimiter +
          "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
          JSON.stringify(metadata) +
          delimiter +
          "Content-Type: application/epub+zip\r\n\r\n"
      ),
      Buffer.from(fileBuffer),
      Buffer.from(closeDelimiter),
    ]);

    const uploadRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
          "Content-Length": multipartRequestBody.length.toString(),
        },
        body: multipartRequestBody,
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error("Failed to upload to Google Drive:", uploadData);
      return NextResponse.json({ error: uploadData.error?.message || "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${file.name} to Kobo eReader folder`,
      file: uploadData,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
