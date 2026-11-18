"use client";

import React, { useState, useEffect } from "react";
import GoogleMapsVisualizer from "@/components/GoogleMapsVisualizer";
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
  Plus,
  Link as LinkIcon,
  Sparkles,
  MapPin,
  Compass,
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

  // Google Calendar API Enable check
  const [calNeedsApiEnable, setCalNeedsApiEnable] = useState(false);
  const [calApiEnableUrl, setCalApiEnableUrl] = useState("https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=958553719884");

  // Secret iCal URL state (100% reliable Google Calendar sync without OAuth)
  const [showIcalInput, setShowIcalInput] = useState(false);
  const [icalUrl, setIcalUrl] = useState("");
  const [icalSaving, setIcalSaving] = useState(false);
  const [icalMessage, setIcalMessage] = useState<string | null>(null);

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

      // 2. Fetch Google Calendar events (try OAuth first, then fallback to saved iCal if present)
      let eventsLoaded = false;
      try {
        const calRes = await fetch("/api/calendar/events");
        const calData = await calRes.json();
        if (calData.needsApiEnable) {
          setCalNeedsApiEnable(true);
          if (calData.apiEnableUrl) setCalApiEnableUrl(calData.apiEnableUrl);
        } else {
          setCalNeedsApiEnable(false);
        }
        if (calData.events && calData.events.length > 0) {
          setCalendarEvents(calData.events);
          eventsLoaded = true;
        }
      } catch (e) {
        console.warn("OAuth calendar fetch skipped/failed:", e);
      }

      // Check saved iCal feed if OAuth had no events
      if (!eventsLoaded && typeof window !== "undefined") {
        const savedIcal = localStorage.getItem("lifehub_gcal_ics_url") || "";
        if (savedIcal) {
          setIcalUrl(savedIcal);
          const icsRes = await fetch("/api/calendar/ics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: savedIcal }),
          });
          const icsData = await icsRes.json();
          if (icsData.success && icsData.events) {
            setCalendarEvents(icsData.events);
          }
        }
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

  const handleSaveIcalFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!icalUrl.trim()) return;

    setIcalSaving(true);
    setIcalMessage(null);
    try {
      const res = await fetch("/api/calendar/ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: icalUrl.trim() }),
      });
      const data = await res.json();
      if (data.success && data.events) {
        setCalendarEvents(data.events);
        if (typeof window !== "undefined") {
          localStorage.setItem("lifehub_gcal_ics_url", icalUrl.trim());
        }
        setIcalMessage(`Successfully connected! ${data.events.length} events loaded directly from Google Calendar.`);
        setShowIcalInput(false);
      } else {
        setIcalMessage(data.error || "Could not read Google Calendar iCal feed. Please verify the URL.");
      }
    } catch (err) {
      setIcalMessage("Error connecting to iCal feed. Check URL and try again.");
    } finally {
      setIcalSaving(false);
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

      if (googleConnected) {
        const serviceName =
          googleConnected === "calendar"
            ? "Google Calendar"
            : googleConnected === "drive"
            ? "Google Drive"
            : googleConnected === "youtube"
            ? "YouTube Music"
            : "Google Service";

        setUrlMessage({
          type: "success",
          title: `${serviceName} Connected!`,
          description: "Authentication successful. Your live data is now synchronizing smoothly into Life Hub.",
        });
      } else if (googleDisconnected === "true") {
        setUrlMessage({
          type: "info",
          title: "Google Sessions Cleared",
          description: "All Google access tokens have been safely purged from your browser.",
        });
      } else if (googleError) {
        setShowGuide(true);
        if (googleError === "access_denied") {
          setUrlMessage({
            type: "error",
            title: "Access Denied by Google",
            description:
              "Google blocked the sign-in. If you see 'Life Hub has not completed the Google verification process', add your email under 'Test Users' in Google Cloud Console, or click 'Advanced' > 'Go to Life Hub (unsafe)' on the security screen.",
          });
        } else if (googleError === "missing_credentials") {
          setUrlMessage({
            type: "error",
            title: "Missing Google Credentials",
            description: "Google Client ID or Client Secret is missing in environment variables.",
          });
        } else if (googleError === "token_exchange_failed") {
          setUrlMessage({
            type: "error",
            title: "Token Exchange Failed",
            description: "Google did not complete token exchange. Please check redirect URI in Google Cloud Console.",
          });
        } else {
          setUrlMessage({
            type: "error",
            title: "Connection Alert",
            description: `Google returned: ${googleError}. Each service below can now be connected independently.`,
          });
        }
      }
    }
  }, []);

  const isConnected = !!status?.connected || calendarEvents.length > 0;
  const isCalConnected = !!status?.services.calendar.connected || calendarEvents.length > 0;
  const isDriveConnected = !!status?.services.drive.connected;
  const isYtConnected = !!status?.services.youtube.connected;

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
              className="text-xs opacity-60 hover:opacity-100 px-2 py-1 rounded bg-black/30 font-mono cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 1. MASTER EXECUTIVE STATUS BANNER (No single fragile button, clear multi-service status) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
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
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                      Modular Integration
                    </span>
                  )}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Independent connections for Google Calendar, Google Drive, and YouTube Music. Connect each service individually below.
                </p>
              </div>
            </div>

            {/* Individual Service Live Status Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
              <span
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  isCalConnected
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isCalConnected ? "bg-emerald-400" : "bg-neutral-500"}`} />
                Calendar: {isCalConnected ? "Live Synced" : "Not Linked"}
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  isDriveConnected
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isDriveConnected ? "bg-emerald-400" : "bg-neutral-500"}`} />
                Drive: {isDriveConnected ? "Live Synced" : "Not Linked"}
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  isYtConnected
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isYtConnected ? "bg-emerald-400" : "bg-neutral-500"}`} />
                YouTube: {isYtConnected ? "Live Synced" : "Not Linked"}
              </span>

              <span className="px-2.5 py-1 rounded-lg border bg-neutral-900 border-neutral-800 text-neutral-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Maps: 7 Hubs Plotted
              </span>
            </div>

            {/* Account Profile Details if Available */}
            {status?.user.name && (
              <div className="flex items-center gap-3 pt-1 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-semibold text-white">{status.user.name}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-400">{status.user.email || "Google Account"}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-neutral-500 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Google Session</span>
                </div>
              </div>
            )}
          </div>

          {/* Master Deck Controls */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={fetchGoogleData}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-white" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Sync All Feeds"}</span>
            </button>

            <a
              href="#google-maps-visualizer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Geospatial Map</span>
            </a>

            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
              title="Toggle Setup & Fix Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
              {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isConnected && (
              <a
                href="/api/auth/google/logout"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-red-500/10 hover:border-red-500/30 text-neutral-400 hover:text-red-300 transition-all cursor-pointer"
                title="Disconnect Google Sessions"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect All</span>
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
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer"
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
                When signing in, Google shows a security warning because Life Hub accesses private calendar/drive feeds.
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
                Ensure these services are toggled <strong>Enabled</strong> in your Google Cloud Project:
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

            {/* STEP 5: Reset Old Cached Permissions */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-bold">5</span>
                <span>Reset Conflicting Grants in Google Account</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                If Google remembered an old conflicting scope from a prior attempt, open your Google Account permissions and remove Life Hub so Google clears its memory:
              </p>
              <div className="pt-1 flex items-center gap-3">
                <a
                  href="https://myaccount.google.com/connections"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-all"
                >
                  <span>Google Account Third-Party Connections</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
                <span className="text-[11px] text-neutral-500">
                  Click <strong>Life Hub</strong> → Click <strong>Delete all connections</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THREE INDEPENDENT DEDICATED SERVICE HUBS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1: GOOGLE CALENDAR (Dual Option: 1-Click OAuth OR Secret iCal Feed) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14151b] border border-[#232530] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Google Calendar</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">Real-Time Schedule</span>
                </div>
              </div>

              {isCalConnected ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {calendarEvents.length} Events Synced
                </span>
              ) : (
                <a
                  href="/api/auth/google/login?service=calendar"
                  className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black font-bold font-mono transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Connect</span>
                </a>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Synchronizes corporate meetings, personal agendas, and reminders directly into your daily schedule.
            </p>

            {/* Google Calendar API Enable Required Notice */}
            {calNeedsApiEnable && (
              <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>1-Click Setup: Enable Google Calendar API</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Your Google Account signed in successfully! However, Google Calendar API is disabled by default on Google Cloud projects. Click below to toggle it on:
                </p>
                <a
                  href={calApiEnableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Enable Google Calendar API</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

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
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500 space-y-2">
                  <p>Not connected yet. You can connect using Google Sign-In or your secret iCal link.</p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <a
                      href="/api/auth/google/login?service=calendar"
                      className="px-3 py-1.5 rounded-lg bg-white text-black font-bold font-mono text-[11px] hover:bg-neutral-200"
                    >
                      Connect Calendar
                    </a>
                    <button
                      onClick={() => setShowIcalInput((p) => !p)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-[11px]"
                    >
                      {showIcalInput ? "Hide iCal" : "Use iCal Link"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Direct iCal Feed Integration (100% Reliable without OAuth) */}
            {showIcalInput && (
              <form onSubmit={handleSaveIcalFeed} className="p-3 rounded-xl bg-black/60 border border-neutral-800 space-y-2 text-xs">
                <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Google Calendar Secret iCal Address</span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  In Google Calendar → Settings → Integrate calendar → Copy <strong>Secret address in iCal format</strong>. Zero OAuth setup required!
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                    value={icalUrl}
                    onChange={(e) => setIcalUrl(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    disabled={icalSaving}
                    className="px-3 py-1 bg-white text-black font-bold rounded-lg text-xs hover:bg-neutral-200 font-mono cursor-pointer disabled:opacity-50"
                  >
                    {icalSaving ? "Syncing..." : "Sync"}
                  </button>
                </div>
                {icalMessage && <p className="text-[10px] text-emerald-400">{icalMessage}</p>}
              </form>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
            <button
              onClick={() => setShowIcalInput((p) => !p)}
              className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showIcalInput ? "Close iCal" : "Paste iCal Feed"}</span>
            </button>
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-neutral-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Launch Calendar</span>
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

              {isDriveConnected ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {driveFiles.length} Synced
                </span>
              ) : (
                <a
                  href="/api/auth/google-drive/login"
                  className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black font-bold font-mono transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Connect</span>
                </a>
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
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500 space-y-2">
                  <p>{isDriveConnected ? "No files found in 'Kobo eReader' folder." : "Not connected to Google Drive."}</p>
                  {!isDriveConnected && (
                    <a
                      href="/api/auth/google-drive/login"
                      className="inline-block px-3 py-1.5 rounded-lg bg-white text-black font-bold font-mono text-[11px] hover:bg-neutral-200"
                    >
                      Connect Google Drive
                    </a>
                  )}
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

              {isYtConnected ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {ytPlaylists.length} Synced
                </span>
              ) : (
                <a
                  href="/api/auth/youtube/login"
                  className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black font-bold font-mono transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Connect</span>
                </a>
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
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500 space-y-2">
                  <p>{isYtConnected ? "No public playlists found in YouTube account." : "Not connected to YouTube Music."}</p>
                  {!isYtConnected && (
                    <a
                      href="/api/auth/youtube/login"
                      className="inline-block px-3 py-1.5 rounded-lg bg-white text-black font-bold font-mono text-[11px] hover:bg-neutral-200"
                    >
                      Connect YouTube Music
                    </a>
                  )}
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

      {/* 3. GOOGLE MAPS & GEOSPATIAL INTELLIGENCE SUITE */}
      <div id="google-maps-visualizer" className="scroll-mt-6">
        <GoogleMapsVisualizer />
      </div>

      {/* 4. GOOGLE WORKSPACE EXECUTIVE DOCK (1-Click Access) */}
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

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            { name: "Gmail", icon: Mail, url: "https://mail.google.com", subtitle: "Executive Inbox" },
            { name: "Calendar", icon: Calendar, url: "https://calendar.google.com", subtitle: "Schedules" },
            { name: "Drive", icon: HardDrive, url: "https://drive.google.com", subtitle: "Cloud Vault" },
            { name: "Maps", icon: MapPin, url: "https://maps.google.com", subtitle: "Geospatial" },
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
                className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/60 transition-all flex flex-col items-center justify-center text-center space-y-1.5 group cursor-pointer"
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
