"use client";

import React, { useState } from "react";
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  Brain,
  BookmarkPlus,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Info,
} from "lucide-react";

export interface ExtractedHighlight {
  id: string;
  bookTitle: string;
  author: string;
  chapter: string;
  quote: string;
  note?: string;
  mentalModel?: string;
  selected: boolean;
}

interface KoboHighlightsModalProps {
  onClose: () => void;
  onImport: (highlights: ExtractedHighlight[]) => void;
  existingBookTitles: string[];
}

export default function KoboHighlightsModal({
  onClose,
  onImport,
  existingBookTitles,
}: KoboHighlightsModalProps) {
  const [activeTab, setActiveTab] = useState<"import" | "guide">("import");
  const [rawText, setRawText] = useState("");
  const [parsedItems, setParsedItems] = useState<ExtractedHighlight[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  // Parser logic for Kobo annotations exports
  const parseAnnotations = (text: string) => {
    if (!text.trim()) {
      setParsedItems([]);
      return;
    }

    const lines = text.split("\n").map((l) => l.trim());
    const items: ExtractedHighlight[] = [];

    // Detect format
    // Format A: Standard Kobo text export
    // Line 1: Book Title
    // Line 2: Author
    // Followed by blocks of annotations
    let detectedBook = "Strategic Reading Note";
    let detectedAuthor = "Kobo Reader";

    // Check if first lines look like title & author
    if (lines.length > 2 && lines[0] && !lines[0].startsWith("#") && !lines[0].startsWith(">")) {
      detectedBook = lines[0].replace(/^["']|["']$/g, "");
      if (lines[1] && !lines[1].includes(":") && lines[1].length < 60) {
        detectedAuthor = lines[1];
      }
    }

    // Split text into chunks by common separators (---, Chapter, Page, or double newlines)
    const blocks = text.split(/(?:---|={3,}|\n\s*\n\s*\n)/);

    let counter = 1;
    for (let block of blocks) {
      const cleanBlock = block.trim();
      if (!cleanBlock || cleanBlock.length < 15) continue;

      // Extract quote (either enclosed in quotes, or starting with > or text after Highlight/Bookmark)
      let quote = cleanBlock;
      let chapter = "General Passage";
      let userNote = "";
      let mentalModel = "";

      // Match lines
      const blockLines = cleanBlock.split("\n").map((l) => l.trim()).filter(Boolean);

      for (let line of blockLines) {
        if (/^(chapter|section|part|page)\b/i.test(line)) {
          chapter = line;
        } else if (/^(note|annotation|thought):\s*/i.test(line)) {
          userNote = line.replace(/^(note|annotation|thought):\s*/i, "").trim();
        } else if (/^(quote|highlight):\s*/i.test(line)) {
          quote = line.replace(/^(quote|highlight):\s*/i, "").trim();
        }
      }

      // If quote is untouched and block has markdown quote format
      if (quote === cleanBlock) {
        const mdQuotes = blockLines
          .filter((l) => l.startsWith(">"))
          .map((l) => l.replace(/^>\s*/, ""))
          .join(" ");
        if (mdQuotes) quote = mdQuotes;
      }

      // Clean leading and trailing quotation marks
      quote = quote.replace(/^["'“]|["'”]$/g, "").trim();

      // Guess mental model tag based on keywords
      const lower = quote.toLowerCase();
      if (lower.includes("chokepoint") || lower.includes("moat") || lower.includes("monopoly")) {
        mentalModel = "Chokepoint Moats";
      } else if (lower.includes("system") || lower.includes("feedback") || lower.includes("delay")) {
        mentalModel = "Systems Dynamics";
      } else if (lower.includes("bottleneck") || lower.includes("leverage") || lower.includes("limiting step")) {
        mentalModel = "Operational Leverage";
      } else if (lower.includes("habit") || lower.includes("compound") || lower.includes("atomic")) {
        mentalModel = "1% Compounding";
      } else if (lower.includes("debt") || lower.includes("cycle") || lower.includes("capital")) {
        mentalModel = "Capital Cycles";
      } else {
        mentalModel = "Strategic Framework";
      }

      if (quote.length > 10) {
        items.push({
          id: `kobo-hl-${Date.now()}-${counter++}`,
          bookTitle: detectedBook,
          author: detectedAuthor,
          chapter,
          quote,
          note: userNote || undefined,
          mentalModel,
          selected: true,
        });
      }
    }

    setParsedItems(items);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setRawText(content);
      parseAnnotations(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImportSubmit = () => {
    const selected = parsedItems.filter((i) => i.selected);
    if (selected.length === 0) return;

    onImport(selected);
    setImportedCount(selected.length);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-neutral-950 border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                Kobo Highlights & Notes Importer
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-normal">
                  Kobo eReader & Drive
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Transform eReader underlines into actionable mental models on your Strategic Bookshelf
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800/80 bg-neutral-950 text-xs">
          <button
            onClick={() => setActiveTab("import")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "import"
                ? "border-indigo-500 text-white"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Import Highlights
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "guide"
                ? "border-indigo-500 text-white"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            How to Export from Kobo
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "import" && (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                }`}
              >
                <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                <p className="text-xs font-semibold text-white">
                  Drag and drop your Kobo export file here (.txt, .md, .csv)
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  or select an annotations file from your Mac
                </p>
                <label className="mt-3 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                  Browse File
                  <input
                    type="file"
                    accept=".txt,.md,.csv,.json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>

              {/* Direct Paste Box */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-neutral-400 font-semibold">Or Paste Exported Notes Directly:</label>
                  {rawText && (
                    <button
                      onClick={() => {
                        setRawText("");
                        setParsedItems([]);
                      }}
                      className="text-[10px] text-neutral-500 hover:text-rose-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    parseAnnotations(e.target.value);
                  }}
                  placeholder="Paste annotations from Kobo or Google Drive here..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Sample Quick-Paste for Instant Preview */}
              {parsedItems.length === 0 && (
                <div className="p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Want to test with a sample Kobo export?</span>
                  </div>
                  <button
                    onClick={() => {
                      const sample = `Chip War: The Fight for the World's Most Critical Technology
Chris Miller
---
Chapter 14: The Lithography Monopoly
"ASML's extreme ultraviolet lithography systems are arguably the most complicated machinery humans have ever created, weighing 180 metric tons and containing hundreds of thousands of parts."
Note: This is the single biggest operational chokepoint on planet earth.
---
Thinking in Systems
Donella H. Meadows
---
Chapter 2: System Dynamics
"A system must consist of three kinds of things: elements, interconnections, and a function or purpose."
Note: Always look for feedback delays before altering system parameters.`;
                      setRawText(sample);
                      parseAnnotations(sample);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-[11px] font-semibold transition-colors"
                  >
                    Load Sample Notes
                  </button>
                </div>
              )}

              {/* Parsed Highlights Preview */}
              {parsedItems.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-purple-400" />
                      Detected Highlights ({parsedItems.length})
                    </span>
                    <button
                      onClick={() => {
                        const allSelected = parsedItems.every((i) => i.selected);
                        setParsedItems((prev) => prev.map((i) => ({ ...i, selected: !allSelected })));
                      }}
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      {parsedItems.every((i) => i.selected) ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {parsedItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          item.selected
                            ? "bg-neutral-900 border-indigo-500/40"
                            : "bg-neutral-900/40 border-neutral-800 opacity-60"
                        } space-y-2`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() =>
                                setParsedItems((prev) =>
                                  prev.map((i, iIdx) =>
                                    iIdx === idx ? { ...i, selected: !i.selected } : i
                                  )
                                )
                              }
                              className="rounded border-neutral-700 text-indigo-600 focus:ring-0"
                            />
                            <div>
                              <span className="text-xs font-bold text-white">{item.bookTitle}</span>
                              <span className="text-[10px] text-neutral-400 ml-1.5">
                                • {item.chapter}
                              </span>
                            </div>
                          </label>

                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                            {item.mentalModel}
                          </span>
                        </div>

                        <blockquote className="text-xs text-neutral-200 italic border-l-2 border-indigo-500/60 pl-3">
                          "{item.quote}"
                        </blockquote>

                        {item.note && (
                          <p className="text-[11px] text-indigo-300 pl-3">
                            <strong>My Note:</strong> {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "guide" && (
            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Turn on 1-Touch Highlights Export on Kobo
                </h3>
                <p className="text-neutral-300">
                  Kobo e-readers have a hidden native feature that exports all your book highlights and notes into clean text files automatically.
                </p>
              </div>

              <div className="space-y-3 pl-2">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Plug your Kobo into your Mac</strong> with a USB cable and tap "Connect" on the Kobo screen.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Reveal hidden folders:</strong> In Mac Finder, press{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[10px]">
                      Cmd + Shift + .
                    </kbd>{" "}
                    to show hidden dotfiles.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Open the config file:</strong> Go to{" "}
                    <code className="text-indigo-300">.kobo/Kobo/Kobo eReader.conf</code> and open it with TextEdit.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-white">Add the export setting:</strong> Scroll to{" "}
                    <code className="text-indigo-300">[FeatureSettings]</code> and add:
                    <pre className="mt-1.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-300 font-mono text-[11px]">
                      ExportHighlights=true
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    <strong className="text-white">Done!</strong> Now on your Kobo, whenever you open any book, tap the three dots menu → tap{" "}
                    <span className="text-emerald-400 font-semibold">"Export annotations"</span>. It drops a `.txt` file onto your device or Google Drive that you can drag straight into LifeHub!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/60">
          <div className="text-xs text-neutral-400">
            {importedCount !== null ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Successfully imported {importedCount} highlights!
              </span>
            ) : (
              <span>
                {parsedItems.filter((i) => i.selected).length} highlights selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImportSubmit}
              disabled={parsedItems.filter((i) => i.selected).length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              <BookmarkPlus className="w-4 h-4" />
              Import to Bookshelf
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
