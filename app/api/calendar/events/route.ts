import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  let accessToken =
    cookieStore.get("gcal_access_token")?.value ||
    cookieStore.get("google_access_token")?.value;
  const refreshToken =
    cookieStore.get("gcal_refresh_token")?.value ||
    cookieStore.get("google_refresh_token")?.value;

  // Attempt token refresh if access token expired
  if (!accessToken && refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
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
        accessToken = data.access_token;
      }
    } catch (e) {
      console.error("Failed to refresh Google Calendar token:", e);
    }
  }

  if (!accessToken) {
    return NextResponse.json({
      connected: false,
      events: [],
      message: "Google Calendar is not connected via OAuth.",
    });
  }

  try {
    const now = new Date();
    // Fetch events starting from beginning of current month to 60 days ahead
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

    const calUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      startDate
    )}&timeMax=${encodeURIComponent(endDate)}&singleEvents=true&orderBy=startTime&maxResults=50`;

    const calRes = await fetch(calUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 60 },
    });

    if (!calRes.ok) {
      const errData = await calRes.text();
      console.error("Google Calendar API error:", calRes.status, errData);
      return NextResponse.json({
        connected: false,
        events: [],
        error: `Google Calendar returned status ${calRes.status}`,
      });
    }

    const calData = await calRes.json();
    const rawEvents = calData.items || [];

    const events = rawEvents.map((item: any) => {
      const startDateTime = item.start?.dateTime ? new Date(item.start.dateTime) : null;
      const startDateOnly = item.start?.date || null;

      let timeFormatted = "All Day";
      let dateKey = "";
      let dayNumber = 16;

      if (startDateTime) {
        timeFormatted = startDateTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        dateKey = startDateTime.toISOString().split("T")[0];
        dayNumber = startDateTime.getDate();
      } else if (startDateOnly) {
        dateKey = startDateOnly;
        const parts = startDateOnly.split("-");
        if (parts.length === 3) {
          dayNumber = parseInt(parts[2], 10);
        }
      }

      return {
        id: item.id,
        title: item.summary || "Google Calendar Event",
        time: timeFormatted,
        category: "Google Calendar",
        completed: false,
        isGCal: true,
        htmlLink: item.htmlLink || "https://calendar.google.com",
        location: item.location || "",
        description: item.description || "",
        dateKey,
        day: dayNumber,
      };
    });

    return NextResponse.json({
      connected: true,
      count: events.length,
      events,
      syncedAt: new Date().toISOString(),
      accountName: calData.summary || "Primary Calendar",
    });
  } catch (err: any) {
    console.error("Error fetching Google Calendar events:", err);
    return NextResponse.json(
      { connected: false, events: [], error: err.message || "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}
