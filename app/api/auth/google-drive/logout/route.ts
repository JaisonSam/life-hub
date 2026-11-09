import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const response = NextResponse.redirect(`${baseUrl}/?gdrive_disconnected=true#books`);
  response.cookies.delete("gdrive_access_token");
  response.cookies.delete("gdrive_refresh_token");

  return response;
}
