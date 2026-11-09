"use client";

import React, { useState, useEffect } from "react";
import {
  FolderSync,
  UploadCloud,
  BookOpen,
  Sparkles,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  HardDrive,
  Plus,
} from "lucide-react";

export interface KoboDriveFile {
  id: string;
  name: string;
  fullName: string;
  size: string;
  modifiedTime: string;
  webViewLink?: string;
  downloadUrl: string;
}

interface KoboDriveDeckProps {
  onOpenReader: (source: ArrayBuffer | File | string, title: string) => void;
  onOpenHighlightsModal: () => void;
}

export default function KoboDriveDeck({
  onOpenReader,
  onOpenHighlightsModal,
}: KoboDriveDeckProps) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [folderFound, setFolderFound] = useState(false);
  const [folderName, setFolderName] = useState("Kobo eReader");
  const [files, setFiles] = useState<KoboDriveFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [needsApiEnable, setNeedsApiEnable] = useState(false);
  const [apiEnableUrl, setApiEnableUrl] = useState("https://console.cloud.google.com/apis/library/drive.googleapis.com");

  // Check URL params for gdrive status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("gdrive_connected")) {
        setUploadMessage("Google Drive successfully connected!");
        setTimeout(() => setUploadMessage(null), 4000);
      }
    }
  }, []);

  const fetchDriveFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kobo/drive-files");
      const data = await res.json();

      setConnected(!!data.connected);
      setFolderFound(!!data.folderFound);
      if (data.folderName) setFolderName(data.folderName);
      setFiles(data.files || []);
      setApiError(data.error || null);
      setNeedsApiEnable(!!data.needsApiEnable);
      if (data.apiEnableUrl) setApiEnableUrl(data.apiEnableUrl);
    } catch (err) {
      console.error("Failed to fetch Google Drive files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveFiles();
  }, []);

  // Upload an EPUB file to Kobo Google Drive folder
  const handleUploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".epub")) {
      alert("Please upload a valid .epub file");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage(`Uploading "${file.name}" to Kobo Google Drive...`);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/kobo/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadMessage(`"${file.name}" uploaded to Kobo folder! Your eReader will sync on Wi-Fi.`);
      fetchDriveFiles();
      setTimeout(() => setUploadMessage(null), 5000);
    } catch (err: any) {
      console.error("Upload error:", err);
      // Fallback: If Google Drive is not connected, open in local reader
      setUploadMessage(`Note: Opening "${file.name}" in local LifeHub reader.`);
      onOpenReader(file, file.name.replace(/\.epub$/i, ""));
      setTimeout(() => setUploadMessage(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  // Open a local EPUB file immediately in the reader
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onOpenReader(file, file.name.replace(/\.epub$/i, ""));
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800/90 shadow-2xl space-y-5">
      {/* Deck Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg shadow-amber-500/20">
            <FolderSync className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white tracking-tight">
                Kobo eReader & Google Drive Cloud Shelf
              </h3>
              {connected ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Drive Connected
                </span>
              ) : (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold font-mono">
                  Cloud Ready
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400">
              Synchronize EPUBs from your Kobo folder, read on your Mac, and extract strategic highlights
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {connected ? (
            <>
              <button
                onClick={fetchDriveFiles}
                disabled={loading}
                className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                title="Refresh Google Drive files"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
              </button>
              <a
                href="/api/auth/google-drive/logout"
                className="px-3 py-1.5 rounded-xl border border-neutral-800 text-[11px] font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                Disconnect
              </a>
            </>
          ) : (
            <a
              href="/api/auth/google-drive/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
            >
              <FolderSync className="w-3.5 h-3.5" />
              Connect Google Drive
            </a>
          )}

          {/* Highlights importer button */}
          <button
            onClick={onOpenHighlightsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Import Kobo Notes
          </button>
        </div>
      </div>

      {/* Upload / Sync Alert Toast */}
      {uploadMessage && (
        <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/50 text-indigo-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          {uploadMessage}
        </div>
      )}

      {/* Google Drive API Enable Alert */}
      {needsApiEnable && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            1-Click Setup: Enable Google Drive API for your Google Cloud Project
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            Your Google Account signed in successfully! However, Google Drive access is disabled by default on new Google Cloud projects. Click below to toggle it on:
          </p>
          <a
            href={apiEnableUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md shadow-amber-600/30 transition-all"
          >
            <span>Enable Google Drive API</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Main Grid: Send to Kobo Dropzone + Drive EPUBs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Dropzone Column */}
        <div className="lg:col-span-4 space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all min-h-[180px] ${
              isDragging
                ? "border-amber-500 bg-amber-500/10"
                : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
            }`}
          >
            <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-xs font-bold text-white">Send to Kobo & Cloud</span>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed">
              Drop an <strong className="text-white">.epub</strong> file here to push into your Drive Kobo folder
            </p>

            <div className="mt-3 flex items-center gap-2">
              <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm">
                <Plus className="w-3 h-3 text-amber-400" />
                Upload EPUB
                <input
                  type="file"
                  accept=".epub"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadFile(e.target.files[0]);
                  }}
                />
              </label>

              {/* Direct local reader picker */}
              <label className="px-2.5 py-1.5 border border-neutral-700 text-neutral-300 hover:text-white rounded-xl text-[11px] font-medium cursor-pointer transition-colors" title="Read any EPUB on your Mac without uploading">
                Open Local
                <input
                  type="file"
                  accept=".epub"
                  className="hidden"
                  onChange={handleLocalFileSelect}
                />
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <span className="font-semibold text-neutral-300 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              How Kobo Wi-Fi Sync Works:
            </span>
            <p>
              EPUBs uploaded to Google Drive arrive on your Kobo whenever Wi-Fi is active. You can also read them right here on your Mac!
            </p>
          </div>
        </div>

        {/* EPUB Files List Column */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              {connected
                ? `Kobo eReader Library (${files.length} Ebooks Found)`
                : "Google Drive Kobo Preview"}
            </span>

            {connected && folderFound && (
              <span className="text-[10px] text-emerald-400 font-mono">
                📁 Linked to '{folderName}'
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <p className="text-xs">Scanning Google Drive for Kobo EPUBs...</p>
            </div>
          ) : connected && files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                        {file.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 shrink-0">
                        {file.size}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Modified {new Date(file.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                    <button
                      onClick={() => onOpenReader(file.downloadUrl, file.name)}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-[11px] font-semibold transition-all shadow-sm"
                    >
                      <BookOpen className="w-3 h-3" />
                      Read in LifeHub
                    </button>

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-500 hover:text-white transition-colors"
                        title="Open in Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 flex flex-col items-center text-center space-y-3">
              <BookOpen className="w-8 h-8 text-neutral-600" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">
                  {connected
                    ? "No .epub files found in your Kobo eReader Drive folder"
                    : "Connect Google Drive to View Your Kobo Books"}
                </h4>
                <p className="text-[11px] text-neutral-400 max-w-sm">
                  {connected
                    ? "Drag and drop any EPUB into the left box to upload it to your Kobo, or open any file locally."
                    : "Once connected, LifeHub will list all your ebooks and let you read them in your browser or extract annotations."}
                </p>
              </div>

              {!connected && (
                <a
                  href="/api/auth/google-drive/login"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  Connect Google Drive
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
