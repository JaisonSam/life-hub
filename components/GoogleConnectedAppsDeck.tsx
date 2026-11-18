"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  HardDrive,
  Music,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Mail,
  FileSpreadsheet,
  FileText,
  Video,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Info,
  HelpCircle,
} from "lucide-react";

interface GoogleServiceStatus {
  connected: boolean;
  name: string;
  description: string;
}

interface GoogleStatusData {
  connected: boolean;
  user: {
    name: string | null;
    email: string | null;
    picture: string | null;
  };
  services: {
    calendar: GoogleServiceStatus;
    drive: GoogleServiceStatus;
    youtube: GoogleServiceStatus;
    workspace: GoogleServiceStatus;
  };
  syncedAt?: string;
}

export default function GoogleConnectedAppsDeck() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<GoogleStatusData | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [ytPlaylists, setYtPlaylists] = useState<any[]>([]);

  // Feedback banner state from URL query parameters
  const [urlMessage, setUrlMessage] = useState<{
    type: "success" | "error" | "info";
    title: string;
    description: string;
  } | null>(null);

  // Setup / Troubleshooting accordion toggle
  const [showGuide, setShowGuide] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  const redirectUri = "https://life-hub-lemon-five.vercel.app/api/auth/youtube/callback";

  const handleCopyUri = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(redirectUri);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    }
  };

  const fetchGoogleData = async () => {
    try {
      setRefreshing(true);
      // 1. Fetch Google overall status
      const statusRes = await fetch("/api/google/status");
      const statusData: GoogleStatusData = await statusRes.json();
      setStatus(statusData);

      // 2. Fetch Google Calendar events
      const calRes = await fetch("/api/calendar/events");
      const calData = await calRes.json();
      if (calData.events) {
        setCalendarEvents(calData.events);
      }

      // 3. Fetch Google Drive files
      const driveRes = await fetch("/api/kobo/drive-files");
      const driveData = await driveRes.json();
      if (driveData.files) {
        setDriveFiles(driveData.files);
      }

      // 4. Fetch YouTube Playlists
      const ytRes = await fetch("/api/youtube/playlists");
      const ytData = await ytRes.json();
      if (ytData.playlists) {
        setYtPlaylists(ytData.playlists);
      }
    } catch (err) {
      console.error("Failed to fetch Google apps data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoogleData();

    // Check URL parameters for status/errors
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const googleConnected = params.get("google_connected") || params.get("gdrive_connected") || params.get("yt_connected");
      const googleError = params.get("google_error") || params.get("gdrive_error") || params.get("yt_error");
      const googleDisconnected = params.get("google_disconnected");

      if (googleConnected === "true") {
        setUrlMessage({
          type: "success",
          title: "Google Account Connected",
          description: "Your Google services are authenticated and actively synchronizing data into Life Hub.",
        });
      } else if (googleDisconnected === "true") {
        setUrlMessage({
          type: "info",
          title: "Google Account Disconnected",
          description: "You have securely signed out of your Google session. Local authorization cookies have been cleared.",
        });
      } else if (googleError) {
        setShowGuide(true); // Automatically expand troubleshooting guide on error
        if (googleError === "access_denied") {
          setUrlMessage({
            type: "error",
            title: "Access Blocked or Denied by Google",
            description:
              "Google blocked the sign-in. In 99% of cases, your Google Cloud project is in 'Testing' mode and your email must be added to 'Test Users', or you need to click 'Advanced' > 'Go to Life Hub (unsafe)' on Google's warning screen. See the fix guide below.",
          });
        } else if (googleError === "missing_credentials") {
          setUrlMessage({
            type: "error",
            title: "Missing Google Credentials",
            description: "Google Client ID or Client Secret is not set in environment variables.",
          });
        } else if (googleError === "token_exchange_failed") {
          setUrlMessage({
            type: "error",
            title: "Token Exchange Failed",
            description: "Google did not complete authorization code exchange. Please verify your redirect URI in Google Cloud Console.",
          });
        } else {
          setUrlMessage({
            type: "error",
            title: "Connection Error",
            description: `Google returned error code: ${googleError}. Follow the setup checklist below to resolve it.`,
          });
        }
      }
    }
  }, []);

  const isConnected = !!status?.connected;

  return (
    <div className="space-y-6">
      {/* FEEDBACK STATUS BANNER (If URL has error or success flag) */}
      {urlMessage && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            urlMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
              : urlMessage.type === "error"
              ? "bg-red-950/40 border-red-500/40 text-red-200"
              : "bg-neutral-900 border-neutral-700 text-neutral-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {urlMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : urlMessage.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm text-white">{urlMessage.title}</h4>
              <p className="text-xs leading-relaxed opacity-90">{urlMessage.description}</p>
            </div>
            <button
              onClick={() => setUrlMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 px-2 py-1 rounded bg-black/30 font-mono"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 1. MASTER GOOGLE ACCOUNT BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Google Connected Apps Hub
                  {isConnected ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Synced
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                      Not Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Direct API integration with Google Calendar, Google Drive, YouTube Music & Google Workspace
                </p>
              </div>
            </div>

            {/* Account Details if Connected */}
            {isConnected && (
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-semibold text-white">{status?.user.name || "Jaison"}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-400">{status?.user.email || "Google Account"}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-neutral-500 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OAuth 2.0 SSL Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={fetchGoogleData}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-white" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Sync All Data"}</span>
            </button>

            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
              title="Toggle Setup & Fix Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
              {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isConnected ? (
              <a
                href="/api/auth/google/logout"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-red-500/10 hover:border-red-500/30 text-neutral-400 hover:text-red-300 transition-all"
                title="Disconnect Google Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </a>
            ) : (
              <a
                href="/api/auth/google/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-lg shadow-white/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
                </svg>
                <span>Connect Google Account</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* SETUP & TROUBLESHOOTING GUIDE (Expandable Card) */}
      {showGuide && (
        <div className="p-6 sm:p-7 rounded-3xl bg-[#14151b] border border-neutral-700/60 shadow-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-neutral-300" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Google Cloud Setup & 3-Step Fix Checklist
              </h3>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* STEP 1: Add Email to Test Users */}
            <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-bold">1</span>
                <span>Fix "Access Blocked / In Testing Mode"</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Because your Google Cloud app is in <strong>Testing</strong> mode, Google only permits emails listed under <strong>Test users</strong> to connect.
              </p>
              <div className="pt-1">
                <a
                  href="https://console.cloud.google.com/apis/credentials/consent"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-all"
                >
                  <span>Open OAuth Consent Screen</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>
              <p className="text-neutral-500 text-[10px]">
                Under <strong>Test users</strong>, click <strong>+ ADD USERS</strong>, type your Gmail address, and click <strong>SAVE</strong>.
              </p>
            </div>

            {/* STEP 2: Bypass "Google hasn't verified this app" */}
            <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-bold">2</span>
                <span>Bypass "Google hasn't verified this app"</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                When signing in, Google shows a security warning because Life Hub accesses your Calendar, Drive & YouTube.
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800 text-[11px] text-neutral-300 font-mono space-y-1">
                <div>1. Click <strong className="text-white underline">Advanced</strong> (bottom-left)</div>
                <div>2. Click <strong className="text-white underline">Go to Life Hub (unsafe)</strong></div>
                <div>3. Check the permission boxes and click <strong className="text-white underline">Continue</strong></div>
              </div>
            </div>

            {/* STEP 3: Authorized Redirect URI Check */}
            <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-bold">3</span>
                <span>Authorized Redirect URI in Google Cloud</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Make sure this exact URI is listed under <strong>Authorized redirect URIs</strong> in your OAuth Client ID:
              </p>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/70 border border-neutral-800">
                <span className="font-mono text-[10px] text-neutral-300 truncate flex-1">{redirectUri}</span>
                <button
                  onClick={handleCopyUri}
                  className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedUri ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUri ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white underline"
              >
                <span>Edit OAuth Client in Google Cloud</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* STEP 4: Enable Required Google APIs */}
            <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-bold">4</span>
                <span>Enable Google APIs for Your Project</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Ensure these three APIs are toggled <strong>Enabled</strong> in your Google Cloud Project:
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <a
                  href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>Calendar API</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                </a>
                <a
                  href="https://console.cloud.google.com/apis/library/drive.googleapis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>Drive API</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                </a>
                <a
                  href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>YouTube Data API</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THREE PRIMARY CONNECTED SERVICES (Calendar, Drive, YouTube) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1: GOOGLE CALENDAR */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14151b] border border-[#232530] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Google Calendar</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">Live API Feed</span>
                </div>
              </div>

              {calendarEvents.length > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                  {calendarEvents.length} Events Synced
                </span>
              ) : isConnected ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  Synced (0 Events)
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  Not Connected
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Synchronizes real meetings, corporate agendas, and reminders directly into your daily schedule.
            </p>

            {/* Upcoming Calendar Events Preview */}
            <div className="space-y-2 pt-2">
              {calendarEvents.slice(0, 3).map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-white truncate">{evt.title}</p>
                    <span className="text-[10px] text-neutral-400 font-mono">{evt.time}</span>
                  </div>
                  {evt.htmlLink && (
                    <a
                      href={evt.htmlLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                      title="Open in Google Calendar"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}

              {calendarEvents.length === 0 && (
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500">
                  {isConnected
                    ? "No upcoming events scheduled in the next 60 days."
                    : "Connect your Google account above to populate your live Calendar agenda."}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-neutral-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Launch Google Calendar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* CARD 2: GOOGLE DRIVE & KOBO CLOUD */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14151b] border border-[#232530] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Google Drive</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">Cloud Shelf & Files</span>
                </div>
              </div>

              {driveFiles.length > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                  {driveFiles.length} Ebooks / Files
                </span>
              ) : isConnected ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  Synced (0 Files)
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  Not Connected
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Synchronizes your 'Kobo eReader' folder for instant EPUB reading, highlights extraction, and cloud storage.
            </p>

            {/* Drive Files Preview */}
            <div className="space-y-2 pt-2">
              {driveFiles.slice(0, 3).map((file, idx) => (
                <div
                  key={file.id || idx}
                  className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-white truncate">{file.name}</p>
                    <span className="text-[10px] text-neutral-400 font-mono">{file.size}</span>
                  </div>
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}

              {driveFiles.length === 0 && (
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500">
                  {isConnected
                    ? "No files found in 'Kobo eReader' folder."
                    : "Connect your Google account above to browse your Drive books and documents."}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-neutral-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Launch Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* CARD 3: YOUTUBE MUSIC STUDIO */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14151b] border border-[#232530] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">YouTube Music</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">Personal Playlists</span>
                </div>
              </div>

              {ytPlaylists.length > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                  {ytPlaylists.length} Playlists
                </span>
              ) : isConnected ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  Synced (0 Playlists)
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  Not Connected
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Streams your curated soundscapes, acoustic worship, and deep focus playlists directly in your browser.
            </p>

            {/* Playlists Preview */}
            <div className="space-y-2 pt-2">
              {ytPlaylists.slice(0, 3).map((pl, idx) => (
                <div
                  key={pl.id || idx}
                  className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-white truncate">{pl.title}</p>
                    <span className="text-[10px] text-neutral-400 font-mono">{pl.itemCount} tracks</span>
                  </div>
                  <a
                    href={`https://music.youtube.com/playlist?list=${pl.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                    title="Open Playlist in YouTube Music"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}

              {ytPlaylists.length === 0 && (
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500">
                  {isConnected
                    ? "No public playlists found in YouTube account."
                    : "Connect your Google account above to load your personal YouTube Music library."}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-neutral-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Launch YouTube Music</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. GOOGLE WORKSPACE EXECUTIVE DOCK (1-Click Access) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14151b] border border-[#232530] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white">
              Google Workspace Executive Shortcuts
            </h3>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">Official Web Suites</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: "Gmail", icon: Mail, url: "https://mail.google.com", subtitle: "Executive Inbox" },
            { name: "Calendar", icon: Calendar, url: "https://calendar.google.com", subtitle: "Schedules" },
            { name: "Drive", icon: HardDrive, url: "https://drive.google.com", subtitle: "Cloud Vault" },
            { name: "Meet", icon: Video, url: "https://meet.google.com", subtitle: "Video Calls" },
            { name: "Docs", icon: FileText, url: "https://docs.google.com", subtitle: "Documents" },
            { name: "Sheets", icon: FileSpreadsheet, url: "https://sheets.google.com", subtitle: "Spreadsheets" },
          ].map((app) => {
            const AppIcon = app.icon;
            return (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/60 transition-all flex flex-col items-center justify-center text-center space-y-1.5 group"
              >
                <AppIcon className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-white group-hover:underline">{app.name}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{app.subtitle}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
