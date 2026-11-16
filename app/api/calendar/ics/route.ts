import { NextResponse } from "next/server";

export interface ParsedCalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string or time string
  end?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  description?: string;
  location?: string;
}

// Simple iCal parser for VEVENT blocks
function parseICS(icsData: string): ParsedCalendarEvent[] {
  const events: ParsedCalendarEvent[] = [];
  const lines = icsData.split(/\r\n|\n|\r/);
  let currentEvent: Partial<ParsedCalendarEvent> & { dtstart?: string; dtend?: string } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("BEGIN:VEVENT")) {
      currentEvent = {};
    } else if (line.startsWith("END:VEVENT") && currentEvent) {
      if (currentEvent.title && currentEvent.dtstart) {
        try {
          // Parse DTSTART (formats: YYYYMMDDTHHMMSSZ or YYYYMMDD)
          const rawStart = currentEvent.dtstart.replace(/^[^:]*:/, "");
          let eventDate = "";
          let eventTime = "All Day";

          if (rawStart.includes("T")) {
            const y = rawStart.slice(0, 4);
            const m = rawStart.slice(4, 6);
            const d = rawStart.slice(6, 8);
            const hh = parseInt(rawStart.slice(9, 11), 10);
            const mm = rawStart.slice(11, 13);
            
            eventDate = `${y}-${m}-${d}`;
            const ampm = hh >= 12 ? "PM" : "AM";
            const displayHours = hh % 12 || 12;
            eventTime = `${String(displayHours).padStart(2, "0")}:${mm} ${ampm}`;
          } else {
            const y = rawStart.slice(0, 4);
            const m = rawStart.slice(4, 6);
            const d = rawStart.slice(6, 8);
            eventDate = `${y}-${m}-${d}`;
          }

          events.push({
            id: currentEvent.id || `evt-${events.length}-${Date.now()}`,
            title: currentEvent.title || "Untitled Activity",
            start: currentEvent.dtstart,
            date: eventDate,
            time: eventTime,
            description: currentEvent.description,
            location: currentEvent.location,
          });
        } catch {}
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith("SUMMARY:")) {
        currentEvent.title = line.replace("SUMMARY:", "").trim();
      } else if (line.startsWith("DTSTART")) {
        currentEvent.dtstart = line;
      } else if (line.startsWith("DTEND")) {
        currentEvent.dtend = line;
      } else if (line.startsWith("UID:")) {
        currentEvent.id = line.replace("UID:", "").trim();
      } else if (line.startsWith("DESCRIPTION:")) {
        currentEvent.description = line.replace("DESCRIPTION:", "").trim();
      } else if (line.startsWith("LOCATION:")) {
        currentEvent.location = line.replace("LOCATION:", "").trim();
      }
    }
  }

  return events;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing calendar ICS URL" }, { status: 400 });
    }

    // Fetch the raw ICS data from Google Calendar
    const res = await fetch(url, {
      headers: {
        "User-Agent": "LifeHub-GlanceCalendar/1.0",
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch Google Calendar feed (HTTP ${res.status})` },
        { status: res.status }
      );
    }

    const icsText = await res.text();
    const events = parseICS(icsText);

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to parse calendar feed" },
      { status: 500 }
    );
  }
}
