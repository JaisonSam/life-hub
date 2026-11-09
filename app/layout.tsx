import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Hub — Jaison's Executive OS & Daily Sanctuary",
  description: "Personal operations, GMAT 715+ sprint, Veerakeralapudur agribusiness, strategic reading, and executive career branding hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030014] text-[#F4F4F6] selection:bg-amber-500/30 selection:text-amber-200 relative">
        {children}
      </body>
    </html>
  );
}
