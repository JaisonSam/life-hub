import { NextResponse } from "next/server";
import { parseICSContent } from "@/lib/calendarActivities";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing calendar ICS URL" }, { status: 400 });
    }

    // Validate that it looks like a calendar or ICS URL
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid URL format. Expected http:// or https://" }, { status: 400 });
    }

    // Fetch the raw ICS data from Google Calendar
    const res = await fetch(trimmed, {
      headers: {
        "User-Agent": "Mozilla/5.0 (LifeHub-GlanceCalendar/1.0)",
        Accept: "text/calendar, text/plain, */*",
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Calendar returned status HTTP ${res.status}. Please check your secret iCal link.` },
        { status: res.status }
      );
    }

    const icsText = await res.text();
    if (!icsText || !icsText.includes("BEGIN:VCALENDAR")) {
      return NextResponse.json(
        { error: "The provided URL did not return a valid iCalendar (ICS) feed." },
        { status: 422 }
      );
    }

    const events = parseICSContent(icsText);

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch or parse calendar feed" },
      { status: 500 }
    );
  }
}
