export interface DynamicHabit {
  id: string;
  name: string;
  category: "Spiritual" | "Health" | "Growth" | "Career" | "Agri-Tech";
  streak: number;
  completedToday: boolean;
  targetPerWeek?: number;
  description?: string;
}

export const DEFAULT_HABITS: DynamicHabit[] = [
  {
    id: "h-scripture",
    name: "Morning Scripture & Prayer",
    category: "Spiritual",
    streak: 14,
    completedToday: false,
    description: "Daily liturgical Scripture reading and contemplative prayer.",
  },
  {
    id: "h-gmat",
    name: "GMAT 705+ Focus Sprint (45m)",
    category: "Growth",
    streak: 6,
    completedToday: false,
    description: "Official MBA.com Quant / Data Insights timed problem sets.",
  },
  {
    id: "h-workout",
    name: "10,000 Steps / Physical Conditioning",
    category: "Health",
    streak: 5,
    completedToday: false,
    description: "Zone-2 cardio, strength mobility, and posture recovery.",
  },
  {
    id: "h-farm",
    name: "Farm IoT & Drip Line Inspection",
    category: "Agri-Tech",
    streak: 8,
    completedToday: false,
    description: "Monitor Tirunelveli soil moisture & automated fertigation status.",
  },
  {
    id: "h-career",
    name: "ERP BA Architecture & Executive Mastery",
    category: "Career",
    streak: 4,
    completedToday: false,
    description: "Schneider Electric systems thinking, integration specs, and AI agents.",
  },
  {
    id: "h-reading",
    name: "Kobo Intellectual Hub (30m)",
    category: "Growth",
    streak: 9,
    completedToday: false,
    description: "Mental models, geopolitics, and deep philosophy via Kobo reader.",
  },
];

/**
 * Returns date formatted as YYYY-MM-DD
 */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Loads habits for a specific date from localStorage.
 * Resets completedToday if the user enters a new day!
 */
export function loadDailyHabits(targetDateKey: string = getDateKey()): DynamicHabit[] {
  if (typeof window === "undefined") return DEFAULT_HABITS;

  try {
    const rawHistory = localStorage.getItem("lifehub_habits_history");
    const history: Record<string, Record<string, boolean>> = rawHistory ? JSON.parse(rawHistory) : {};

    const rawBase = localStorage.getItem("lifehub_habits_base");
    const baseHabits: DynamicHabit[] = rawBase ? JSON.parse(rawBase) : DEFAULT_HABITS;

    const todayChecks = history[targetDateKey] || {};

    // Calculate dynamic streaks by looking backwards through days
    return baseHabits.map((habit) => {
      const isCompletedToday = Boolean(todayChecks[habit.id]);

      // Calculate real streak backwards from yesterday
      let streak = isCompletedToday ? 1 : 0;
      let checkDate = new Date();
      if (!isCompletedToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      for (let i = 0; i < 60; i++) {
        const dKey = getDateKey(checkDate);
        if (history[dKey] && history[dKey][habit.id]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // If user had an existing stored baseline streak, add it if no history yet
      const finalStreak = Math.max(streak, habit.streak || 0);

      return {
        ...habit,
        completedToday: isCompletedToday,
        streak: isCompletedToday ? finalStreak : Math.max(0, finalStreak - (streak === 0 ? 0 : 0)),
      };
    });
  } catch (e) {
    console.error("Error loading daily habits:", e);
    return DEFAULT_HABITS;
  }
}

/**
 * Saves habit toggle for today's date
 */
export function toggleDailyHabitStorage(
  habitId: string,
  targetDateKey: string = getDateKey()
): DynamicHabit[] {
  if (typeof window === "undefined") return DEFAULT_HABITS;

  try {
    const rawHistory = localStorage.getItem("lifehub_habits_history");
    const history: Record<string, Record<string, boolean>> = rawHistory ? JSON.parse(rawHistory) : {};

    if (!history[targetDateKey]) {
      history[targetDateKey] = {};
    }

    const currentVal = Boolean(history[targetDateKey][habitId]);
    history[targetDateKey][habitId] = !currentVal;

    localStorage.setItem("lifehub_habits_history", JSON.stringify(history));

    return loadDailyHabits(targetDateKey);
  } catch (e) {
    console.error("Error toggling daily habit:", e);
    return DEFAULT_HABITS;
  }
}
