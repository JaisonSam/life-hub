import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const response = NextResponse.redirect(`${baseUrl}/?google_disconnected=true#google`);

  const cookiesToClear = [
    "google_access_token",
    "google_refresh_token",
    "gdrive_access_token",
    "gdrive_refresh_token",
    "yt_access_token",
    "yt_refresh_token",
    "gcal_access_token",
    "gcal_refresh_token",
    "google_user_name",
    "google_user_email",
    "google_user_picture",
  ];

  cookiesToClear.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  });

  return response;
}
