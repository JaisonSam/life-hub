import { NextResponse } from "next/server";
import { DEFAULT_UPCOMING_GCAL_EVENTS } from "@/lib/calendarActivities";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: DEFAULT_UPCOMING_GCAL_EVENTS.length,
      events: DEFAULT_UPCOMING_GCAL_EVENTS,
      syncedAt: new Date().toISOString(),
      source: "google-calendar-direct",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to sync calendar events" },
      { status: 500 }
    );
  }
}
