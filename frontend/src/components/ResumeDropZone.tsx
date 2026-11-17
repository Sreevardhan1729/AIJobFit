import React, { useRef, useState } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";

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
          className={`border px-4 py-3.5 transition-colors ${dragging ? "border-ink bg-paper" : "border-rule bg-sheet"}`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} aria-hidden className="shrink-0 text-ink" />
            <div className="min-w-0 flex-1">
              <p role="status" className="text-sm font-semibold text-ink">
                Resume added<span className="sr-only">: {selectedFile.name}</span>
              </p>
              <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink">
                <span className="truncate" title={selectedFile.name}>{selectedFile.name}</span>
                <span className="shrink-0 text-ink-2">·</span>
                <span className="shrink-0 text-ink-2">{formatSize(selectedFile.size)}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm font-medium">
              <button
                type="button"
                aria-label={`Replace ${selectedFile.name}`}
                onClick={openChooser}
                className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
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
                  className="text-ink-2 underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-ink"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {note && <p className="mt-2 pl-[34px] text-xs text-ink-2">{note}</p>}
        </div>
      ) : (
        <div
          {...dropHandlers}
          className={`flex flex-col items-center justify-center gap-2 border border-dashed px-6 py-8 text-center transition-colors ${
            dragging ? "border-ink bg-paper" : "border-ink-2/60 bg-sheet hover:border-ink"
          }`}
        >
          <UploadCloud size={26} aria-hidden className="text-ink-2" />
          <p className="text-sm text-ink">
            Drop your resume PDF here or{" "}
            <button type="button" onClick={openChooser} className="font-semibold text-ink underline underline-offset-4">
              choose a file
            </button>
          </p>
          <p className="text-xs text-ink-2">{hint}</p>
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
        <p role="alert" className="mt-2 text-sm text-miss-text">
          {error}
        </p>
      )}
    </div>
  );
}
