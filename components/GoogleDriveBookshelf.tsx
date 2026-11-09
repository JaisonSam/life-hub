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
  BookmarkPlus,
  Trash2,
  Check,
  Search,
  Lightbulb,
} from "lucide-react";

export interface DriveEpubBook {
  id: string;
  name: string;
  fullName: string;
  size: string;
  modifiedTime: string;
  downloadUrl: string;
  webViewLink?: string;
  progress: number;
  status: "Reading" | "Completed" | "Queue";
  mentalModel?: string;
  notes?: string;
  keyQuote?: string;
}

interface GoogleDriveBookshelfProps {
  onOpenReader: (source: ArrayBuffer | File | string, title: string) => void;
  onOpenHighlightsModal: () => void;
  filter: "all" | "reading" | "completed";
  searchQuery: string;
}

export default function GoogleDriveBookshelf({
  onOpenReader,
  onOpenHighlightsModal,
  filter,
  searchQuery,
}: GoogleDriveBookshelfProps) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [folderName, setFolderName] = useState("Kobo eReader");
  const [books, setBooks] = useState<DriveEpubBook[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingNoteBookId, setEditingNoteBookId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [tempModel, setTempModel] = useState("");

  // Load books & merge with localStorage metadata
  const fetchDriveBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kobo/drive-files");
      const data = await res.json();

      setConnected(!!data.connected);
      if (data.folderName) setFolderName(data.folderName);

      // Load saved progress & notes from localStorage
      let savedMeta: Record<string, Partial<DriveEpubBook>> = {};
      try {
        const raw = localStorage.getItem("lifehub_kobo_meta");
        if (raw) savedMeta = JSON.parse(raw);
      } catch {}

      const loadedFiles: DriveEpubBook[] = (data.files || []).map((f: any) => {
        const meta = savedMeta[f.id] || {};
        return {
          id: f.id,
          name: f.name,
          fullName: f.fullName,
          size: f.size,
          modifiedTime: f.modifiedTime,
          downloadUrl: f.downloadUrl,
          webViewLink: f.webViewLink,
          progress: meta.progress ?? 0,
          status: meta.status ?? "Reading",
          mentalModel: meta.mentalModel ?? undefined,
          notes: meta.notes ?? undefined,
          keyQuote: meta.keyQuote ?? undefined,
        };
      });

      // If no files from Drive, add sample strategy brief as initial book
      if (loadedFiles.length === 0) {
        const sampleMeta = savedMeta["sample-brief"] || {};
        loadedFiles.push({
          id: "sample-brief",
          name: "Strategic Mental Models: Systems, Moats & Leverage",
          fullName: "sample-strategy-brief.epub",
          size: "45 KB",
          modifiedTime: new Date().toISOString(),
          downloadUrl: "/sample-strategy-brief.epub",
          progress: sampleMeta.progress ?? 85,
          status: sampleMeta.status ?? "Reading",
          mentalModel: sampleMeta.mentalModel ?? "Chokepoint Capitalism & Limiting Steps",
          keyQuote: sampleMeta.keyQuote ?? "Identify where value accumulates at the irreplaceable limiting step, and establish dominance or insulation around that dependency.",
          notes: sampleMeta.notes ?? "Essential operational synthesis covering Chip War, Systems Dynamics, and High Output Management.",
        });
      }

      setBooks(loadedFiles);
    } catch (err) {
      console.error("Failed to load Google Drive books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveBooks();
  }, []);

  const saveBookMeta = (bookId: string, updates: Partial<DriveEpubBook>) => {
    setBooks((prev) => {
      const updated = prev.map((b) => (b.id === bookId ? { ...b, ...updates } : b));
      try {
        let savedMeta: Record<string, any> = {};
        const raw = localStorage.getItem("lifehub_kobo_meta");
        if (raw) savedMeta = JSON.parse(raw);
        savedMeta[bookId] = { ...(savedMeta[bookId] || {}), ...updates };
        localStorage.setItem("lifehub_kobo_meta", JSON.stringify(savedMeta));
      } catch {}
      return updated;
    });
  };

  const handleUploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".epub")) {
      alert("Please upload an .epub file");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage(`Pushing "${file.name}" to Kobo Google Drive folder...`);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/kobo/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadMessage(`"${file.name}" uploaded to Google Drive! Will sync to Kobo on Wi-Fi.`);
      fetchDriveBooks();
      setTimeout(() => setUploadMessage(null), 5000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadMessage(`Opening "${file.name}" in local reader.`);
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

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onOpenReader(file, file.name.replace(/\.epub$/i, ""));
    }
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    if (filter === "reading" && book.status !== "Reading") return false;
    if (filter === "completed" && book.status !== "Completed") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        book.name.toLowerCase().includes(q) ||
        (book.mentalModel && book.mentalModel.toLowerCase().includes(q)) ||
        (book.notes && book.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Upload Toast */}
      {uploadMessage && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/50 text-indigo-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          {uploadMessage}
        </div>
      )}

      {/* Top Shelf Controls: Sync Status & Send to Kobo Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Send to Kobo & Cloud Dropzone */}
        <div className="lg:col-span-4 space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all min-h-[170px] ${
              isDragging
                ? "border-amber-500 bg-amber-500/10"
                : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
            }`}
          >
            <UploadCloud className="w-7 h-7 text-amber-400 mb-2" />
            <span className="text-xs font-bold text-white">Send to Kobo & Cloud</span>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed">
              Drop any <strong className="text-white">.epub</strong> here to upload into Drive and sync to your Kobo
            </p>

            <div className="mt-3 flex items-center gap-2">
              <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/25">
                <Plus className="w-3.5 h-3.5" />
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

          <div className="p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              Kobo Google Drive Sync:
            </span>
            <p>
              EPUBs uploaded to Google Drive arrive automatically on your Kobo whenever Wi-Fi is on. You can also read them right here in LifeHub.
            </p>
          </div>
        </div>

        {/* Cloud Sync Status & Library Overview Banner */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FolderSync className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Google Drive Kobo Ebook Library
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {connected
                    ? `Linked to Google Drive folder '${folderName}' • ${books.length} Ebooks detected`
                    : "Connect your Google Drive account to sync your Kobo eReader library"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {connected ? (
                <>
                  <button
                    onClick={fetchDriveBooks}
                    disabled={loading}
                    className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Refresh Drive files"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
                  </button>
                  <a
                    href="/api/auth/google-drive/logout"
                    className="px-3 py-1.5 rounded-xl border border-neutral-800 text-[11px] font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    Disconnect
                  </a>
                </>
              ) : (
                <a
                  href="/api/auth/google-drive/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <FolderSync className="w-3.5 h-3.5" />
                  Connect Google Drive
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-800/80 text-center">
            <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-sm font-extrabold text-white font-mono">{books.length}</span>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Total Ebooks</p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-sm font-extrabold text-indigo-400 font-mono">
                {books.filter((b) => b.status === "Reading").length}
              </span>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">In Progress</p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                {books.filter((b) => b.status === "Completed").length}
              </span>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid of Google Drive EPUB Book Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Your Ebook Collection ({filteredBooks.length})
          </span>
          <span className="text-[10px] text-neutral-400">
            Click 'Read' on any book to open in the LifeHub In-Browser EPUB Reader
          </span>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs">Scanning Google Drive for your Kobo EPUBs...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No EPUBs match your filter</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Drop an EPUB into the upload box above to add it to your Kobo, or connect your Google Drive account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-3xl border border-neutral-800/80 bg-neutral-900/60 hover:border-indigo-500/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {book.size} • EPUB
                      </span>
                      <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                        {book.name}
                      </h3>
                      <p className="text-[10px] text-neutral-500">
                        Synced with Kobo & Google Drive
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        saveBookMeta(book.id, {
                          status: book.status === "Completed" ? "Reading" : "Completed",
                          progress: book.status === "Completed" ? 30 : 100,
                        })
                      }
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 transition-colors ${
                        book.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                      title="Click to toggle status"
                    >
                      {book.status}
                    </button>
                  </div>

                  {/* Reading Progress Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Reading Progress</span>
                      <span className="font-mono text-white font-semibold">{book.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-500 pt-0.5">
                      <button onClick={() => saveBookMeta(book.id, { progress: 25, status: "Reading" })} className="hover:text-neutral-300">25%</button>
                      <button onClick={() => saveBookMeta(book.id, { progress: 50, status: "Reading" })} className="hover:text-neutral-300">50%</button>
                      <button onClick={() => saveBookMeta(book.id, { progress: 75, status: "Reading" })} className="hover:text-neutral-300">75%</button>
                      <button onClick={() => saveBookMeta(book.id, { progress: 100, status: "Completed" })} className="hover:text-neutral-300">100%</button>
                    </div>
                  </div>

                  {/* Core Mental Model Card */}
                  {book.mentalModel ? (
                    <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        Mental Model
                      </div>
                      <div className="font-bold text-white text-xs">{book.mentalModel}</div>
                    </div>
                  ) : null}

                  {/* Key Quote / Highlights */}
                  {book.keyQuote ? (
                    <blockquote className="text-[11px] text-neutral-300 italic border-l-2 border-amber-500/50 pl-3 leading-relaxed line-clamp-3">
                      "{book.keyQuote}"
                    </blockquote>
                  ) : null}

                  {/* Personal Notes / Takeaways */}
                  {book.notes ? (
                    <p className="text-[11px] text-neutral-400 leading-relaxed bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/60">
                      <strong className="text-neutral-300 font-semibold">Strategic Note:</strong> {book.notes}
                    </p>
                  ) : null}

                  {/* Inline Note Editor */}
                  {editingNoteBookId === book.id && (
                    <div className="p-3 rounded-2xl bg-neutral-950 border border-indigo-500/40 space-y-2 animate-in fade-in duration-150">
                      <input
                        type="text"
                        placeholder="Core mental model (e.g. Chokepoint Moats)..."
                        value={tempModel}
                        onChange={(e) => setTempModel(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Actionable strategic takeaway..."
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingNoteBookId(null)}
                          className="px-2.5 py-1 text-[11px] text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            saveBookMeta(book.id, {
                              mentalModel: tempModel.trim() || undefined,
                              notes: tempNote.trim() || undefined,
                            });
                            setEditingNoteBookId(null);
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReader(book.downloadUrl, book.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-semibold transition-all shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingNoteBookId(book.id);
                        setTempModel(book.mentalModel || "");
                        setTempNote(book.notes || "");
                      }}
                      className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
                      title="Add mental model or note"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Note</span>
                    </button>
                  </div>

                  {book.webViewLink && (
                    <a
                      href={book.webViewLink}
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
        )}
      </div>
    </div>
  );
}
