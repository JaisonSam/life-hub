import { NextResponse } from "next/server";
import { getDailyScripture } from "@/lib/dailyScripture";

export async function GET() {
  const scripture = getDailyScripture(new Date());

  return NextResponse.json({
    verse: {
      reference: scripture.reference,
      text: scripture.text,
      translation: scripture.translation,
      theme: scripture.theme,
      reflection: scripture.reflection,
      readingPlan: scripture.readingPlan,
      prayer: scripture.prayer,
    },
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });
}
