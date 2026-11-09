import { NextResponse } from "next/server";

const VERSES = [
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    translation: "NIV",
    theme: "Trust & Guidance",
    reflection: "Surrender worries today and focus on taking each faithful step forward with confidence.",
  },
  {
    reference: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    translation: "NIV",
    theme: "Peace & Prayer",
    reflection: "Exchange anxiety for peace through mindful prayer and steady gratitude.",
  },
  {
    reference: "Isaiah 40:31",
    text: "Those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    translation: "NIV",
    theme: "Strength & Renewal",
    reflection: "Rest your spirit in patience. Strength renews when we align our purpose with perseverance.",
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
    translation: "NIV",
    theme: "Courage",
    reflection: "Courage is not the absence of fear, but walking boldly forward knowing you are supported.",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    translation: "NIV",
    theme: "Purpose & Hope",
    reflection: "Every experience, challenge, and victory weaves together into purposeful growth.",
  },
];

export async function GET() {
  // Select verse based on day of month so it rotates consistently
  const day = new Date().getDate();
  const verse = VERSES[day % VERSES.length];

  return NextResponse.json({
    verse,
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });
}
