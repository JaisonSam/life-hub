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
  FolderSync,
  UploadCloud,
  Mail,
  FileSpreadsheet,
  FileText,
  Video,
  StickyNote,
  Loader2,
  User,
  LogOut,
  ShieldCheck,
  Plus,
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
  }, []);

  const isConnected = !!status?.connected;

  return (
    <div className="space-y-6">
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-white" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Sync All Data"}</span>
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
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  Calendar Ready
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
                  Connect your Google account above to populate your live Calendar agenda.
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
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  Drive Ready
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
                  Connect your Google account above to browse your Drive books and documents.
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
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  Music Ready
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
                  Connect your Google account above to load your personal YouTube Music library.
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
