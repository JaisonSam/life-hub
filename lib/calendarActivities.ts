export interface PlannedActivity {
  id: string;
  title: string;
  time: string; // e.g. "07:30 AM"
  endTime?: string; // e.g. "08:15 AM"
  category: "Spiritual" | "Career" | "GMAT" | "Agri-Tech" | "Health" | "Personal";
  date?: string; // "YYYY-MM-DD"
  dayOfWeek?: number; // 0-6 (Sunday=0, Monday=1, etc.)
  completed?: boolean;
  notes?: string;
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
 * Returns planned activities for any given calendar date.
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

    // First check if there are specific date-bound activities
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
    return [...dateSpecific, ...base];
  } catch (err) {
    console.error("Error in getPlannedActivitiesForDate:", err);
    return DEFAULT_WEEKLY_SCHEDULE;
  }
}

/**
 * Generates an instant 1-click Google Calendar Event Template URL
 */
export function getGoogleCalendarAddUrl(
  activity: PlannedActivity,
  targetDate: Date
): string {
  try {
    if (!activity) return "https://calendar.google.com";
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
    return "https://calendar.google.com";
  }
}
