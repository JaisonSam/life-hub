import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";

  const response = NextResponse.json({ success: true });
  response.cookies.delete("yt_access_token");
  response.cookies.delete("yt_refresh_token");

  return response;
}
