import React, { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";

interface ResumeDropZoneProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  selectedFile?: File | null;
  hint?: string;
  // Where the file goes once used, e.g. "Used for this match only, not saved."
  note?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeDropZone({
  onFileSelect,
  onClear,
  selectedFile,
  hint = "PDF only, up to 10 MB",
  note,
}: ResumeDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const accept = (files: FileList | File[] | null) => {
    const list = files ? Array.from(files) : [];
    if (list.length !== 1 || list[0].type !== "application/pdf") {
      setError("Please drop a single PDF file.");
      return;
    }
    setError("");
    onFileSelect(list[0]);
  };

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      accept(e.dataTransfer.files);
    },
  };
  const openChooser = () => inputRef.current?.click();

  return (
    <div>
      {selectedFile ? (
        // Inline confirmation right where the file was added (not a toast), announced without moving focus.
        <div
          {...dropHandlers}
          className={`rounded-2xl border px-4 py-3.5 transition ${
            dragging ? "border-indigo-400 bg-indigo-950/40" : "border-emerald-700/70 bg-emerald-950/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} aria-hidden className="shrink-0 text-emerald-300" />
            <div className="min-w-0 flex-1">
              <p role="status" className="text-sm font-semibold text-emerald-200">
                Resume added<span className="sr-only">: {selectedFile.name}</span>
              </p>
              <p className="flex min-w-0 items-center gap-1.5 text-sm text-slate-300">
                <FileText size={14} aria-hidden className="shrink-0 text-slate-400" />
                <span className="truncate" title={selectedFile.name}>{selectedFile.name}</span>
                <span className="shrink-0 text-slate-400">·</span>
                <span className="shrink-0 text-slate-400">{formatSize(selectedFile.size)}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm font-medium">
              <button
                type="button"
                aria-label={`Replace ${selectedFile.name}`}
                onClick={openChooser}
                className="text-indigo-300 hover:text-indigo-200"
              >
                Replace
              </button>
              {onClear && (
                <button
                  type="button"
                  aria-label={`Remove ${selectedFile.name}`}
                  onClick={() => {
                    setError("");
                    onClear();
                  }}
                  className="text-slate-300 hover:text-white"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {note && <p className="mt-2 pl-[34px] text-xs text-slate-400">{note}</p>}
        </div>
      ) : (
        <div
          {...dropHandlers}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            dragging ? "border-indigo-400 bg-indigo-950/40" : "border-slate-700 bg-slate-950/40 hover:border-slate-500"
          }`}
        >
          <UploadCloud size={28} aria-hidden className="text-indigo-300" />
          <p className="text-sm text-slate-300">
            Drop your resume PDF here or{" "}
            <button type="button" onClick={openChooser} className="font-semibold text-indigo-300 hover:text-indigo-200">
              choose a file
            </button>
          </p>
          <p className="text-xs text-slate-400">{hint}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          accept(e.target.files);
          e.target.value = ""; // so choosing the same file again still fires a change
        }}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
