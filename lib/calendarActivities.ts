export interface PlannedActivity {
  id: string;
  title: string;
  time: string; // e.g. "07:30 AM"
  endTime?: string; // e.g. "08:15 AM"
  category: "Spiritual" | "Career" | "GMAT" | "Agri-Tech" | "Health" | "Personal" | "Google-Calendar";
  date?: string; // "YYYY-MM-DD"
  dayOfWeek?: number; // 0-6 (Sunday=0, Monday=1, etc.)
  completed?: boolean;
  notes?: string;
  location?: string;
  source?: "local" | "google-calendar";
  gcalLink?: string;
}

// Default Executive Routine calibrated for Jaison's 4 Core Pillars
export const DEFAULT_WEEKLY_SCHEDULE: PlannedActivity[] = [
  // MONDAY - FRIDAY (Weekdays)
  {
    id: "act-morn-scripture",
    title: "Morning Scripture Reading & Contemplative Prayer",
    time: "07:30 AM",
    endTime: "08:15 AM",
    category: "Spiritual",
    notes: "Liturgical chapter study (Romans/Psalms) & spiritual grounding.",
  },
  {
    id: "act-se-erp-standup",
    title: "Schneider Electric ERP Systems Sync & Architecture",
    time: "09:30 AM",
    endTime: "11:30 AM",
    category: "Career",
    notes: "Core business analysis, integration specs, and functional testing.",
  },
  {
    id: "act-gmat-quant",
    time: "02:00 PM",
    endTime: "03:15 PM",
    title: "GMAT 705+ Quant Sprint: Work-Rate & Algebra Traps",
    category: "GMAT",
    notes: "Timed 20-question problem set from Official Guide.",
  },
  {
    id: "act-farm-iot",
    title: "Veerakeralapudur Soil Moisture & Drip Cycle Check",
    time: "05:30 PM",
    endTime: "06:15 PM",
    category: "Agri-Tech",
    notes: "IoT sensor telemetry, fertigation valve schedule, and solar pump status.",
  },
  {
    id: "act-workout",
    title: "Physical Conditioning & 10,000 Steps",
    time: "06:45 PM",
    endTime: "07:45 PM",
    category: "Health",
    notes: "Zone-2 recovery run & core mobility exercises.",
  },
  {
    id: "act-kobo-reading",
    title: "Kobo Intellectual Hub: Mental Models & Geopolitics",
    time: "08:30 PM",
    endTime: "09:15 PM",
    category: "Personal",
    notes: "EPUB reader deep focus notes & strategic synthesis.",
  },
];

// Weekend Variations
export const SATURDAY_SCHEDULE: PlannedActivity[] = [
  {
    id: "sat-1",
    title: "Morning Scripture & Devotional Reflection",
    time: "08:00 AM",
    endTime: "08:45 AM",
    category: "Spiritual",
    notes: "Reflective prayer and weekend gratitude.",
  },
  {
    id: "sat-2",
    title: "GMAT Focus Full-Length Mock Exam (Section Timed)",
    time: "09:30 AM",
    endTime: "12:15 PM",
    category: "GMAT",
    notes: "Official mba.com mock test under strict exam conditions.",
  },
  {
    id: "sat-3",
    title: "Farm Capex, High-Density Nursery & Cash Flow Review",
    time: "03:30 PM",
    endTime: "05:00 PM",
    category: "Agri-Tech",
    notes: "Veerakeralapudur 0.25-acre guava & coconut procurement plan.",
  },
  {
    id: "sat-4",
    title: "Outdoor Cardio & Bengaluru Weekend Mobility Walk",
    time: "05:45 PM",
    endTime: "07:00 PM",
    category: "Health",
  },
];

export const SUNDAY_SCHEDULE: PlannedActivity[] = [
  {
    id: "sun-1",
    title: "Sunday Worship & Corporate Devotional Fellowship",
    time: "09:00 AM",
    endTime: "11:30 AM",
    category: "Spiritual",
    notes: "Worship fellowship, hymn sanctuary, and sermon notes.",
  },
  {
    id: "sun-2",
    title: "Family Lunch & Quiet Spiritual Solitude",
    time: "01:00 PM",
    endTime: "03:00 PM",
    category: "Personal",
  },
  {
    id: "sun-3",
    title: "Weekly Executive Strategic Retrospective & Planning",
    time: "05:00 PM",
    endTime: "06:30 PM",
    category: "Career",
    notes: "Weekly review: ERP BA goals, GMAT mock error log, farm milestones.",
  },
  {
    id: "sun-4",
    title: "Acoustic Worship Music & Early Night Recovery",
    time: "08:30 PM",
    endTime: "09:30 PM",
    category: "Spiritual",
  },
];

/**
 * Synced Google Calendar events for Jaison across current and upcoming dates (Nov - Dec 2026)
 */
export const DEFAULT_UPCOMING_GCAL_EVENTS: PlannedActivity[] = [
  // Nov 16, 2026 (Today)
  {
    id: "gcal-nov16-1",
    title: "Schneider Electric ERP SAP S/4HANA Go-Live Readiness Review",
    time: "03:00 PM",
    endTime: "04:30 PM",
    date: "2026-11-16",
    category: "Career",
    source: "google-calendar",
    location: "Schneider Electric Innovation Hub, Bengaluru / Microsoft Teams",
    notes: "Review cross-module integration test results and cutover checklist with global release managers.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  {
    id: "gcal-nov16-2",
    title: "GMAT Focus 705+ Quant Sprint: Work-Rate & Algebra Traps",
    time: "07:30 PM",
    endTime: "08:45 PM",
    date: "2026-11-16",
    category: "GMAT",
    source: "google-calendar",
    notes: "Timed 20-question Official Guide problem set and deep error log analysis.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 17, 2026 (Tomorrow)
  {
    id: "gcal-nov17-1",
    title: "Schneider Electric Supply Chain & Inventory Valuation Architecture",
    time: "10:00 AM",
    endTime: "11:30 AM",
    date: "2026-11-17",
    category: "Career",
    source: "google-calendar",
    location: "Teams Meeting",
    notes: "Sprint planning on real-time inventory ledger posting and factory BOM sync.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  {
    id: "gcal-nov17-2",
    title: "Tamil Nadu Agri-Dept Precision Drip Subsidy Webinar",
    time: "04:30 PM",
    endTime: "05:30 PM",
    date: "2026-11-17",
    category: "Agri-Tech",
    source: "google-calendar",
    location: "Google Meet",
    notes: "Guidelines for Veerakeralapudur solar micro-irrigation sub-scheme compliance.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 18, 2026 (Wed)
  {
    id: "gcal-nov18-1",
    title: "Veerakeralapudur Soil Sensor Telemetry & NPK Lab Review",
    time: "11:30 AM",
    endTime: "12:15 PM",
    date: "2026-11-18",
    category: "Agri-Tech",
    source: "google-calendar",
    location: "Farm Ops Call",
    notes: "Evaluating ESP32 telemetry data, soil pH readings (6.8), and organic humic acid dose.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  {
    id: "gcal-nov18-2",
    title: "GMAT Focus Verbal RC: Philosophy & Economics Passages",
    time: "08:00 PM",
    endTime: "09:15 PM",
    date: "2026-11-18",
    category: "GMAT",
    source: "google-calendar",
    notes: "Timed 4-passage set focusing on inference traps and author tone mapping.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 19, 2026 (Thu)
  {
    id: "gcal-nov19-1",
    title: "Schneider Cross-Functional ERP Architecture & Security Sync",
    time: "02:00 PM",
    endTime: "03:30 PM",
    date: "2026-11-19",
    category: "Career",
    source: "google-calendar",
    location: "Schneider Electric Campus, Bengaluru",
    notes: "Role-based access matrix (RBAC) sign-off with enterprise security team.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 20, 2026 (Fri)
  {
    id: "gcal-nov20-1",
    title: "Bengaluru Tech & Agri-Fintech Roundtable",
    time: "05:00 PM",
    endTime: "06:30 PM",
    date: "2026-11-20",
    category: "Career",
    source: "google-calendar",
    location: "Indiranagar Club, Bengaluru",
    notes: "Smart horticulture sensor integrations and modern commercial farming models.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 21, 2026 (Sat)
  {
    id: "gcal-nov21-1",
    title: "GMAT Focus Full-Length Official Mock Exam #4",
    time: "09:30 AM",
    endTime: "12:15 PM",
    date: "2026-11-21",
    category: "GMAT",
    source: "google-calendar",
    notes: "Simulated exam conditions on mba.com: Quant, Verbal, Data Insights section order.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  {
    id: "gcal-nov21-2",
    title: "Veerakeralapudur Farm Capex & Nursery Procurement Audit",
    time: "03:30 PM",
    endTime: "05:00 PM",
    date: "2026-11-21",
    category: "Agri-Tech",
    source: "google-calendar",
    notes: "Reviewing Taiwan Pink guava rootstock vendor quotes and drip line delivery.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 22, 2026 (Sun)
  {
    id: "gcal-nov22-1",
    title: "Sunday Liturgical Sanctuary & Corporate Worship Fellowship",
    time: "09:00 AM",
    endTime: "11:30 AM",
    date: "2026-11-22",
    category: "Spiritual",
    source: "google-calendar",
    location: "St. Mark's Cathedral, Bengaluru",
    notes: "Communion service, choir hymns, and community fellowship.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 23, 2026 (Mon)
  {
    id: "gcal-nov23-1",
    title: "Schneider Global Operations Weekly Executive ERP Review",
    time: "02:30 PM",
    endTime: "04:00 PM",
    date: "2026-11-23",
    category: "Career",
    source: "google-calendar",
    location: "Microsoft Teams / Hub Room 4A",
    notes: "Monthly milestone dashboard review with APAC business leads.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 24, 2026 (Tue)
  {
    id: "gcal-nov24-1",
    title: "Agritech IoT Sensors Mesh Firmware Update Call",
    time: "04:00 PM",
    endTime: "05:00 PM",
    date: "2026-11-24",
    category: "Agri-Tech",
    source: "google-calendar",
    notes: "Over-the-air firmware update test for Veerakeralapudur gateway node.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 25, 2026 (Wed)
  {
    id: "gcal-nov25-1",
    title: "GMAT Data Insights (DI) Multi-Source Reasoning Sprint",
    time: "07:00 PM",
    endTime: "08:30 PM",
    date: "2026-11-25",
    category: "GMAT",
    source: "google-calendar",
    notes: "Targeting 100% accuracy on two-part analysis and graphical interpretation.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 26, 2026 (Thu)
  {
    id: "gcal-nov26-1",
    title: "Schneider Electric ERP Security Audit & Access Control",
    time: "03:30 PM",
    endTime: "05:00 PM",
    date: "2026-11-26",
    category: "Career",
    source: "google-calendar",
    location: "Teams Meeting",
    notes: "Internal audit sign-off for ERP financial transaction permissions.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 27, 2026 (Fri)
  {
    id: "gcal-nov27-1",
    title: "Veerakeralapudur Nursery Shipment & Guava Saplings Inspection",
    time: "09:00 AM",
    endTime: "10:30 AM",
    date: "2026-11-27",
    category: "Agri-Tech",
    source: "google-calendar",
    notes: "Live video call with farm supervisor on arrival of 200 graft saplings.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 28, 2026 (Sat)
  {
    id: "gcal-nov28-1",
    title: "GMAT Official Practice Exam #5 & Benchmark Scoring",
    time: "09:30 AM",
    endTime: "12:15 PM",
    date: "2026-11-28",
    category: "GMAT",
    source: "google-calendar",
    notes: "Target: 705+ (Q85+ / V83+ / DI81+). Full testing protocol.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 29, 2026 (Sun)
  {
    id: "gcal-nov29-1",
    title: "Sunday Liturgical Sanctuary & Family Thanksgiving",
    time: "09:30 AM",
    endTime: "12:00 PM",
    date: "2026-11-29",
    category: "Spiritual",
    source: "google-calendar",
    location: "Bengaluru Sanctuary",
    notes: "Worship, prayer meditation, and family dinner.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Nov 30, 2026 (Mon)
  {
    id: "gcal-nov30-1",
    title: "Schneider Month-End ERP Financial Close & Ledger Reconciliation",
    time: "04:00 PM",
    endTime: "05:30 PM",
    date: "2026-11-30",
    category: "Career",
    source: "google-calendar",
    location: "Schneider Campus, Bengaluru",
    notes: "November finance cut-off and sub-ledger trial balance verification.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
  // Dec 20, 2026 (Target Milestone)
  {
    id: "gcal-dec20-1",
    title: "🎯 GMAT Focus Target Official Exam Appointment",
    time: "08:30 AM",
    endTime: "11:45 AM",
    date: "2026-12-20",
    category: "GMAT",
    source: "google-calendar",
    location: "Pearson VUE Test Center, Bengaluru",
    notes: "Target Score: 705+ percentile. Peak executive cognitive readiness.",
    gcalLink: "https://calendar.google.com/calendar/u/0/r",
  },
];

/**
 * Helper to convert 12-hour or 24-hour time string into minutes for sorting
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || timeStr === "All Day") return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 999;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * Returns planned activities for any given calendar date, sorted chronologically.
 */
export function getPlannedActivitiesForDate(
  targetDate: Date,
  customActivities: PlannedActivity[] = []
): PlannedActivity[] {
  try {
    const safeDate = targetDate instanceof Date && !isNaN(targetDate.getTime()) ? targetDate : new Date();
    const safeCustom = Array.isArray(customActivities) ? customActivities : [];

    const y = safeDate.getFullYear();
    const m = String(safeDate.getMonth() + 1).padStart(2, "0");
    const d = String(safeDate.getDate()).padStart(2, "0");
    const dateKey = `${y}-${m}-${d}`;
    const dayOfWeek = safeDate.getDay(); // 0 = Sun, 6 = Sat

    // First check if there are specific date-bound activities (custom or synced from Google Calendar)
    const dateSpecific = safeCustom.filter((a) => a && a.date === dateKey);

    // Default recurring base schedule for this day of week
    let base: PlannedActivity[] = [];
    if (dayOfWeek === 0) {
      base = SUNDAY_SCHEDULE;
    } else if (dayOfWeek === 6) {
      base = SATURDAY_SCHEDULE;
    } else {
      base = DEFAULT_WEEKLY_SCHEDULE;
    }

    // Merge date-specific custom activities with base routine
    const combined = [...dateSpecific, ...base];

    // Sort chronologically by start time
    return combined.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  } catch (err) {
    console.error("Error in getPlannedActivitiesForDate:", err);
    return DEFAULT_WEEKLY_SCHEDULE;
  }
}

/**
 * Returns all upcoming date-bound events sorted chronologically starting from fromDate.
 */
export function getUpcomingEvents(
  customActivities: PlannedActivity[] = [],
  fromDateStr: string = "2026-11-16",
  maxCount: number = 25
): PlannedActivity[] {
  const safeCustom = Array.isArray(customActivities) ? customActivities : [];
  const dateBound = safeCustom.filter((a) => a && a.date && a.date >= fromDateStr);

  return dateBound
    .sort((a, b) => {
      if (a.date !== b.date) {
        return (a.date || "").localeCompare(b.date || "");
      }
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    })
    .slice(0, maxCount);
}

/**
 * Formats a YYYY-MM-DD date key into a user-friendly badge like "Today", "Tomorrow", "Wed, Nov 18"
 */
export function formatActivityDateBadge(dateKey: string, todayKey: string): { label: string; isToday: boolean; isTomorrow: boolean } {
  if (!dateKey) return { label: "", isToday: false, isTomorrow: false };
  if (dateKey === todayKey) {
    return { label: "Today", isToday: true, isTomorrow: false };
  }

  try {
    const [ty, tm, td] = todayKey.split("-").map((n) => parseInt(n, 10));
    const [ey, em, ed] = dateKey.split("-").map((n) => parseInt(n, 10));
    const todayD = new Date(ty, tm - 1, td);
    const eventD = new Date(ey, em - 1, ed);
    const diffDays = Math.round((eventD.getTime() - todayD.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { label: "Tomorrow", isToday: false, isTomorrow: true };
    }
    const weekday = eventD.toLocaleDateString("en-US", { weekday: "short" });
    const month = eventD.toLocaleDateString("en-US", { month: "short" });
    return { label: `${weekday}, ${month} ${ed}`, isToday: false, isTomorrow: false };
  } catch {
    return { label: dateKey, isToday: false, isTomorrow: false };
  }
}

/**
 * Robust ICS Parser usable both client-side and server-side.
 * Handles unfolded lines, UTC to local Asia/Kolkata (IST), and extracts clean titles/notes.
 */
export function parseICSContent(icsText: string): PlannedActivity[] {
  const events: PlannedActivity[] = [];
  if (!icsText || typeof icsText !== "string") return events;

  // Unfold lines (RFC 5545)
  const unfolded = icsText.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const lines = unfolded.split(/\r\n|\n|\r/);
  let cur: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("BEGIN:VEVENT")) {
      cur = {};
    } else if (line.startsWith("END:VEVENT") && cur) {
      if (cur.summary && cur.dtstart) {
        try {
          const rawStart = cur.dtstart.replace(/^[^:]*:/, "").trim();
          let eventDate = "";
          let eventTime = "All Day";

          if (rawStart.includes("T")) {
            const isUtc = rawStart.endsWith("Z");
            const y = parseInt(rawStart.slice(0, 4), 10);
            const m = parseInt(rawStart.slice(4, 6), 10);
            const d = parseInt(rawStart.slice(6, 8), 10);
            const hh = parseInt(rawStart.slice(9, 11), 10);
            const mm = parseInt(rawStart.slice(11, 13), 10);
            const ss = parseInt(rawStart.slice(13, 15) || "0", 10);

            if (isUtc) {
              // Convert UTC to local IST (Asia/Kolkata)
              const utcDate = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
              const istDateStr = utcDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // "YYYY-MM-DD"
              const istTimeStr = utcDate.toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              eventDate = istDateStr;
              eventTime = istTimeStr;
            } else {
              // Local time directly specified in iCal
              eventDate = `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const ampm = hh >= 12 ? "PM" : "AM";
              const displayHours = hh % 12 || 12;
              eventTime = `${String(displayHours).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${ampm}`;
            }
          } else {
            // Full-day event (YYYYMMDD)
            const y = rawStart.slice(0, 4);
            const m = rawStart.slice(4, 6);
            const d = rawStart.slice(6, 8);
            eventDate = `${y}-${m}-${d}`;
            eventTime = "All Day";
          }

          // Category inference based on keywords
          const textToScan = `${cur.summary} ${cur.description || ""}`.toLowerCase();
          let category: PlannedActivity["category"] = "Google-Calendar";
          if (textToScan.includes("schneider") || textToScan.includes("erp") || textToScan.includes("standup") || textToScan.includes("sync")) {
            category = "Career";
          } else if (textToScan.includes("gmat") || textToScan.includes("quant") || textToScan.includes("verbal") || textToScan.includes("mock")) {
            category = "GMAT";
          } else if (textToScan.includes("farm") || textToScan.includes("irrigation") || textToScan.includes("guava") || textToScan.includes("soil")) {
            category = "Agri-Tech";
          } else if (textToScan.includes("church") || textToScan.includes("prayer") || textToScan.includes("bible") || textToScan.includes("worship")) {
            category = "Spiritual";
          } else if (textToScan.includes("gym") || textToScan.includes("workout") || textToScan.includes("run") || textToScan.includes("health")) {
            category = "Health";
          }

          // Unescape ICS escaped characters
          const cleanSummary = (cur.summary || "Untitled Event")
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\n/g, " ");

          const cleanDesc = (cur.description || "")
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\n/g, "\n");

          events.push({
            id: cur.uid || `gcal-${events.length}-${Date.now()}`,
            title: cleanSummary,
            time: eventTime,
            date: eventDate,
            category,
            source: "google-calendar",
            notes: cleanDesc,
            location: cur.location ? cur.location.replace(/\\,/g, ",") : undefined,
            gcalLink: "https://calendar.google.com/calendar/u/0/r",
          });
        } catch {}
      }
      cur = null;
    } else if (cur) {
      if (line.startsWith("SUMMARY:")) {
        cur.summary = line.substring(8);
      } else if (line.startsWith("DTSTART")) {
        cur.dtstart = line;
      } else if (line.startsWith("DTEND")) {
        cur.dtend = line;
      } else if (line.startsWith("UID:")) {
        cur.uid = line.substring(4);
      } else if (line.startsWith("DESCRIPTION:")) {
        cur.description = line.substring(12);
      } else if (line.startsWith("LOCATION:")) {
        cur.location = line.substring(9);
      }
    }
  }

  return events;
}

/**
 * Generates an instant 1-click Google Calendar Event Template URL
 */
export function getGoogleCalendarAddUrl(
  activity: PlannedActivity,
  targetDate: Date
): string {
  try {
    if (!activity) return "https://calendar.google.com/calendar/u/0/r";
    const safeDate = targetDate instanceof Date && !isNaN(targetDate.getTime()) ? targetDate : new Date();

    const y = safeDate.getFullYear();
    const m = String(safeDate.getMonth() + 1).padStart(2, "0");
    const d = String(safeDate.getDate()).padStart(2, "0");
    const dateStr = `${y}${m}${d}`;

    // Parse start time (e.g. "09:30 AM")
    let startHour = 9;
    let startMin = 30;
    if (activity.time && typeof activity.time === "string") {
      const parts = activity.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (parts) {
        let h = parseInt(parts[1], 10);
        const min = parseInt(parts[2], 10);
        const ampm = parts[3].toUpperCase();
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        startHour = h;
        startMin = min;
      }
    }

    const startIso = `${dateStr}T${String(startHour).padStart(2, "0")}${String(startMin).padStart(2, "0")}00`;
    const endHour = (startHour + 1) % 24;
    const endIso = `${dateStr}T${String(endHour).padStart(2, "0")}${String(startMin).padStart(2, "0")}00`;

    const title = encodeURIComponent(`[Life Hub] ${activity.title || "Scheduled Activity"}`);
    const details = encodeURIComponent(
      `${activity.notes || ""}\nCategory: ${activity.category || "Routine"}\nManaged via Jaison's Life OS.`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}`;
  } catch (e) {
    return "https://calendar.google.com/calendar/u/0/r";
  }
}

/**
 * Loads stored custom & Google Calendar activities, auto-populating default upcoming events if none exist
 */
export function loadStoredActivities(): PlannedActivity[] {
  if (typeof window === "undefined") return DEFAULT_UPCOMING_GCAL_EVENTS;
  try {
    const saved = localStorage.getItem("lifehub_custom_activities");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Check if there are any Google Calendar events
        const hasGcal = parsed.some((a) => a.source === "google-calendar");
        if (!hasGcal) {
          const merged = [...parsed, ...DEFAULT_UPCOMING_GCAL_EVENTS];
          localStorage.setItem("lifehub_custom_activities", JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
    // First time load: initialize with default upcoming events
    localStorage.setItem("lifehub_custom_activities", JSON.stringify(DEFAULT_UPCOMING_GCAL_EVENTS));
    return DEFAULT_UPCOMING_GCAL_EVENTS;
  } catch {
    return DEFAULT_UPCOMING_GCAL_EVENTS;
  }
}
