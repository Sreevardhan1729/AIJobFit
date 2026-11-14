import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface ResumeDropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  hint?: string;
}

export default function ResumeDropZone({ onFileSelect, selectedFile, hint = "PDF only, up to 10 MB" }: ResumeDropZoneProps) {
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

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragging ? "border-indigo-400 bg-indigo-950/40" : "border-slate-700 bg-slate-950/40 hover:border-slate-500"
        }`}
      >
        <UploadCloud size={28} aria-hidden className="text-indigo-300" />
        <p className="text-sm text-slate-300">
          Drop your resume PDF here or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            choose a file
          </button>
        </p>
        {selectedFile ? (
          <p className="text-xs text-emerald-300">Selected: {selectedFile.name}</p>
        ) : (
          <p className="text-xs text-slate-400">{hint}</p>
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
      </div>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
