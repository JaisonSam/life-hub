"use client";

import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Type,
  Sun,
  Moon,
  Coffee,
  List,
  BookmarkPlus,
  Loader2,
  Check,
} from "lucide-react";

interface EpubReaderProps {
  epubSource: ArrayBuffer | File | string;
  bookTitle?: string;
  onClose: () => void;
  onCaptureQuote?: (quote: string, chapterTitle: string) => void;
}

interface ChapterItem {
  id: string;
  title: string;
  href: string;
  contentHtml: string;
}

export default function EpubReaderModal({
  epubSource,
  bookTitle = "EPUB Reader",
  onClose,
  onCaptureQuote,
}: EpubReaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [theme, setTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [fontSize, setFontSize] = useState<number>(18);
  const [showToc, setShowToc] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [showQuoteSavedToast, setShowQuoteSavedToast] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse EPUB on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadEpub() {
      try {
        setLoading(true);
        setError(null);

        let data: ArrayBuffer;
        if (typeof epubSource === "string") {
          const res = await fetch(epubSource);
          if (!res.ok) throw new Error(`Failed to fetch EPUB: HTTP ${res.status}`);
          data = await res.arrayBuffer();
        } else if (epubSource instanceof File) {
          data = await epubSource.arrayBuffer();
        } else {
          data = epubSource;
        }

        const zip = await JSZip.loadAsync(data);

        // 1. Find container.xml
        const containerFile = zip.file("META-INF/container.xml");
        if (!containerFile) throw new Error("Invalid EPUB: missing META-INF/container.xml");
        const containerXml = await containerFile.async("string");

        const domParser = new DOMParser();
        const containerDoc = domParser.parseFromString(containerXml, "application/xml");
        const rootfile = containerDoc.querySelector("rootfile");
        const opfPath = rootfile?.getAttribute("full-path") || "content.opf";

        // Determine base path (e.g. "OEBPS/" or "")
        const basePath = opfPath.includes("/") ? opfPath.substring(0, opfPath.lastIndexOf("/") + 1) : "";

        // 2. Read OPF file
        const opfFile = zip.file(opfPath);
        if (!opfFile) throw new Error(`Invalid EPUB: missing ${opfPath}`);
        const opfXml = await opfFile.async("string");
        const opfDoc = domParser.parseFromString(opfXml, "application/xml");

        // Parse Manifest: id -> href
        const manifestMap = new Map<string, { href: string; mediaType: string }>();
        opfDoc.querySelectorAll("manifest > item").forEach((item) => {
          const id = item.getAttribute("id");
          const href = item.getAttribute("href");
          const mediaType = item.getAttribute("media-type") || "";
          if (id && href) {
            manifestMap.set(id, { href, mediaType });
          }
        });

        // Parse Spine: array of itemrefs
        const spineItems: string[] = [];
        opfDoc.querySelectorAll("spine > itemref").forEach((itemref) => {
          const idref = itemref.getAttribute("idref");
          if (idref && manifestMap.has(idref)) {
            spineItems.push(idref);
          }
        });

        // 3. Extract Chapter contents
        const loadedChapters: ChapterItem[] = [];

        for (let i = 0; i < spineItems.length; i++) {
          const idref = spineItems[i];
          const manifestItem = manifestMap.get(idref)!;
          const fullHref = basePath + manifestItem.href;

          const chapterFile = zip.file(fullHref);
          if (!chapterFile) continue;

          let rawContent = await chapterFile.async("string");

          // Clean up HTML
          const chapterDoc = domParser.parseFromString(rawContent, "text/html");

          // Extract title if available
          const title =
            chapterDoc.querySelector("h1, h2, h3, title")?.textContent?.trim() ||
            `Section ${loadedChapters.length + 1}`;

          // Resolve internal images to base64 data URLs
          const imgElements = chapterDoc.querySelectorAll("img, image");
          for (let img of Array.from(imgElements)) {
            const srcAttr = img.getAttribute("src") || img.getAttribute("xlink:href");
            if (srcAttr && !srcAttr.startsWith("http") && !srcAttr.startsWith("data:")) {
              // Resolve relative path
              const cleanSrc = srcAttr.replace(/^\.\//, "");
              const imgFullPath = basePath + cleanSrc;
              const imgFile = zip.file(imgFullPath);
              if (imgFile) {
                const mimeType = cleanSrc.endsWith(".png")
                  ? "image/png"
                  : cleanSrc.endsWith(".gif")
                  ? "image/gif"
                  : "image/jpeg";
                const base64Data = await imgFile.async("base64");
                img.setAttribute("src", `data:${mimeType};base64,${base64Data}`);
              }
            }
          }

          // Extract body content or root
          const bodyHtml = chapterDoc.body ? chapterDoc.body.innerHTML : chapterDoc.documentElement.innerHTML;

          loadedChapters.push({
            id: idref,
            title,
            href: manifestItem.href,
            contentHtml: bodyHtml,
          });
        }

        if (loadedChapters.length === 0) {
          throw new Error("Could not find any readable text chapters in this EPUB.");
        }

        if (!isCancelled) {
          setChapters(loadedChapters);
          setCurrentChapterIdx(0);
          setLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("EPUB Loading Error:", err);
          setError(err.message || "Failed to parse EPUB");
          setLoading(false);
        }
      }
    }

    loadEpub();

    return () => {
      isCancelled = true;
    };
  }, [epubSource]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (currentChapterIdx < chapters.length - 1) {
          setCurrentChapterIdx((prev) => prev + 1);
          contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (e.key === "ArrowLeft") {
        if (currentChapterIdx > 0) {
          setCurrentChapterIdx((prev) => prev - 1);
          contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapterIdx, chapters.length, onClose]);

  // Handle text selection for quick quote capture
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 10) {
      setSelectedText(selection.toString().trim());
    }
  };

  const captureSelectedQuote = () => {
    if (!selectedText) return;
    const currentChapter = chapters[currentChapterIdx];
    if (onCaptureQuote) {
      onCaptureQuote(selectedText, currentChapter?.title || "Selected Passage");
    }
    setShowQuoteSavedToast(true);
    setSelectedText("");
    setTimeout(() => setShowQuoteSavedToast(false), 3000);
  };

  const currentChapter = chapters[currentChapterIdx];

  // Theme styles with explicit color hexes and contrast palettes
  const themeClasses = {
    dark: {
      bg: "bg-neutral-950",
      pageBg: "bg-neutral-900/80 border border-neutral-800/80 shadow-2xl",
      text: "text-neutral-100",
      subtext: "text-neutral-400",
      border: "border-neutral-800",
      navBg: "bg-neutral-900/95",
      accent: "text-indigo-400",
      colorHex: "#f3f4f6",
      headingHex: "#ffffff",
      quoteBorder: "#6366f1",
      divider: "border-neutral-800",
      hoverBg: "hover:bg-neutral-800/60",
    },
    sepia: {
      bg: "bg-[#f4ecd8]",
      pageBg: "bg-[#fcf8ed] border border-[#e0d3bc] shadow-xl",
      text: "text-[#3d2e1e]",
      subtext: "text-[#7a644c]",
      border: "border-[#e0d3bc]",
      navBg: "bg-[#ebdcc3]/95",
      accent: "text-amber-800",
      colorHex: "#3d2e1e",
      headingHex: "#261c12",
      quoteBorder: "#b45309",
      divider: "border-[#e0d3bc]",
      hoverBg: "hover:bg-[#ebdcc3]",
    },
    light: {
      bg: "bg-neutral-100",
      pageBg: "bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-400/20",
      text: "text-neutral-900",
      subtext: "text-neutral-500",
      border: "border-neutral-200",
      navBg: "bg-white/95",
      accent: "text-indigo-600",
      colorHex: "#111827",
      headingHex: "#030712",
      quoteBorder: "#4f46e5",
      divider: "border-neutral-200",
      hoverBg: "hover:bg-neutral-200/70",
    },
  }[theme];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses.bg} ${themeClasses.text} backdrop-blur-xl animate-in fade-in duration-200`}>
      {/* Scoped CSS enforcing high-contrast text across all themes */}
      <style>{`
        .epub-content, .epub-content p, .epub-content div, .epub-content span, .epub-content li, .epub-content section, .epub-content article {
          color: ${themeClasses.colorHex} !important;
        }
        .epub-content h1, .epub-content h2, .epub-content h3, .epub-content h4, .epub-content h5, .epub-content h6, .epub-content strong, .epub-content b {
          color: ${themeClasses.headingHex} !important;
          font-weight: 700 !important;
        }
        .epub-content blockquote {
          border-left: 3px solid ${themeClasses.quoteBorder} !important;
          padding-left: 1.25rem !important;
          margin: 1.5rem 0 !important;
          font-style: italic !important;
          color: ${themeClasses.colorHex} !important;
        }
        .epub-content p {
          margin-bottom: 1.25rem !important;
          line-height: 1.8 !important;
        }
        .epub-content a {
          color: ${theme === "sepia" ? "#92400e" : "#4f46e5"} !important;
          text-decoration: underline !important;
        }
      `}</style>
      {/* Top Reader Navigation Bar */}
      <header
        className={`flex items-center justify-between px-4 sm:px-8 py-3.5 border-b ${themeClasses.border} ${themeClasses.navBg} backdrop-blur-md sticky top-0 z-20`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border ${themeClasses.border} hover:opacity-80 transition-opacity`}
            title="Close Reader (Esc)"
          >
            <X className={`w-4 h-4 ${themeClasses.text}`} />
          </button>
          <div>
            <h1 className={`font-bold text-sm sm:text-base ${themeClasses.text} truncate max-w-[200px] sm:max-w-md`}>
              {bookTitle}
            </h1>
            <p className={`text-[10px] ${themeClasses.subtext}`}>
              {chapters.length > 0
                ? `Chapter ${currentChapterIdx + 1} of ${chapters.length} • ${Math.round(
                    ((currentChapterIdx + 1) / chapters.length) * 100
                  )}% read`
                : "Loading EPUB..."}
            </p>
          </div>
        </div>

        {/* Reader Controls: Font Size, Theme, TOC */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <div className={`flex items-center p-1 rounded-xl border ${themeClasses.border} gap-1`}>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-indigo-600 text-white" : "text-neutral-400"}`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("sepia")}
              className={`p-1.5 rounded-lg ${theme === "sepia" ? "bg-amber-700 text-white" : "text-neutral-400"}`}
              title="Warm Sepia Theme"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg ${theme === "light" ? "bg-neutral-800 text-white" : "text-neutral-400"}`}
              title="Paper Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font size */}
          <div className={`hidden sm:flex items-center px-2 py-1 rounded-xl border ${themeClasses.border} gap-2`}>
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className={`text-xs font-bold px-1.5 ${themeClasses.text}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className={`text-[10px] font-mono ${themeClasses.text}`}>{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              className={`text-sm font-bold px-1.5 ${themeClasses.text}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Table of contents toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-xl border ${themeClasses.border} ${themeClasses.text} hover:opacity-80 transition-opacity flex items-center gap-1.5 text-xs font-medium`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Contents</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside
            className={`w-72 sm:w-80 border-r ${themeClasses.border} ${themeClasses.navBg} overflow-y-auto p-4 space-y-2 z-10 shrink-0 shadow-2xl animate-in slide-in-from-left duration-200`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-700/40">
              <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.text}`}>
                Table of Contents
              </span>
              <button onClick={() => setShowToc(false)} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setCurrentChapterIdx(idx);
                    setShowToc(false);
                    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    idx === currentChapterIdx
                      ? "bg-indigo-600 text-white font-bold"
                      : `${themeClasses.text} ${themeClasses.hoverBg}`
                  }`}
                >
                  <span className="truncate pr-2">{ch.title || `Chapter ${idx + 1}`}</span>
                  <span className="text-[10px] opacity-60">#{idx + 1}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Reading Canvas */}
        <main
          ref={contentRef}
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto p-6 sm:p-12 md:p-16 flex flex-col items-center select-text"
        >
          {loading && (
            <div className="my-auto flex flex-col items-center gap-3 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-xs font-medium">Unpacking EPUB structure & illustrations...</p>
            </div>
          )}

          {error && (
            <div className="my-auto max-w-md p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 space-y-3 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-rose-400" />
              <h3 className="font-bold text-sm">Unable to Open EPUB</h3>
              <p className="text-xs text-rose-200/80">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Return to Bookshelf
              </button>
            </div>
          )}

          {!loading && !error && currentChapter && (
            <div className={`w-full max-w-3xl ${themeClasses.pageBg} p-6 sm:p-12 md:p-16 rounded-3xl space-y-8 animate-in fade-in duration-300 pb-20 transition-all`}>
              {/* Chapter Header */}
              <div className={`pb-4 border-b ${themeClasses.divider} text-center space-y-1`}>
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-500 font-bold">
                  Chapter {currentChapterIdx + 1} of {chapters.length}
                </span>
                <h2 className={`text-xl sm:text-2xl font-extrabold ${themeClasses.text}`}>
                  {currentChapter.title}
                </h2>
              </div>

              {/* Rendered Chapter HTML with scoped typography */}
              <div
                className="epub-content max-w-none leading-relaxed transition-all"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: currentChapter.contentHtml }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Floating Quote Capture Action Pill */}
      {selectedText && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-neutral-950 text-white border border-indigo-500/50 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold max-w-xs truncate">
            "{selectedText}"
          </span>
          <button
            onClick={captureSelectedQuote}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-indigo-600/30"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            Save to Commonplace
          </button>
          <button
            onClick={() => setSelectedText("")}
            className="text-neutral-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quote Saved Toast */}
      {showQuoteSavedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xl animate-in zoom-in-95 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          Passage saved to Strategic Commonplace Notebook!
        </div>
      )}

      {/* Footer Navigation Bar */}
      <footer
        className={`flex items-center justify-between px-4 sm:px-8 py-3 border-t ${themeClasses.border} ${themeClasses.navBg} backdrop-blur-md`}
      >
        <button
          onClick={() => {
            if (currentChapterIdx > 0) {
              setCurrentChapterIdx((prev) => prev - 1);
              contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          disabled={currentChapterIdx === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border ${themeClasses.border} text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed ${themeClasses.text}`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Progress bar */}
        <div className="hidden sm:flex flex-col items-center gap-1 w-64">
          <div className="w-full bg-neutral-800/40 h-1.5 rounded-full overflow-hidden border border-neutral-700/20">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all"
              style={{
                width: `${chapters.length > 0 ? ((currentChapterIdx + 1) / chapters.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            Chapter {currentChapterIdx + 1} of {chapters.length} (Use ← / → keys)
          </span>
        </div>

        <button
          onClick={() => {
            if (currentChapterIdx < chapters.length - 1) {
              setCurrentChapterIdx((prev) => prev + 1);
              contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          disabled={chapters.length === 0 || currentChapterIdx === chapters.length - 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border ${themeClasses.border} text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed ${themeClasses.text}`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
