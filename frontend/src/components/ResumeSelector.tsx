import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import type { Resume } from "../types";
import ResumeDropZone from "./ResumeDropZone";

interface ResumeSelectorProps {
  onResumeSelect: (resumeId: string) => void;
  onFileSelect: (file: File) => void;
  onFileClear?: () => void;
  selectedResumeId?: string;
  selectedFile?: File | null;
}

const TAB = "border-b-2 pb-1 text-sm transition-colors";
const TAB_ON = "border-ink font-semibold text-ink";
const TAB_OFF = "border-transparent text-ink-2 hover:text-ink";

export default function ResumeSelector({
  onResumeSelect,
  onFileSelect,
  onFileClear,
  selectedResumeId,
  selectedFile,
}: ResumeSelectorProps) {
  const { isAuthenticated } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"saved" | "upload">(selectedFile ? "upload" : "saved");

  useEffect(() => {
    if (isAuthenticated) {
      loadResumes();
    }
  }, [isAuthenticated]);

  // A file chosen from outside (e.g. "Try the sample") should be visible, not hidden behind the saved list.
  useEffect(() => {
    if (selectedFile) setMode("upload");
  }, [selectedFile]);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const data = await api.listResumes();
      setResumes(data.resumes);
      if (data.resumes.length === 0) {
        setMode("upload");
      }
    } catch {
      setMode("upload");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteResume(id);
    await loadResumes();
  };

  if (!isAuthenticated) {
    return (
      <ResumeDropZone
        onFileSelect={onFileSelect}
        onClear={onFileClear}
        selectedFile={selectedFile}
        note="Used for this run only, not saved."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-5">
        <button
          type="button"
          onClick={() => setMode("saved")}
          className={`${TAB} ${mode === "saved" ? TAB_ON : TAB_OFF}`}
        >
          Saved resume
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`${TAB} ${mode === "upload" ? TAB_ON : TAB_OFF}`}
        >
          Upload new
        </button>
      </div>

      {mode === "saved" && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-ink-2">Loading...</p>
          ) : resumes.length === 0 ? (
            <p className="text-sm text-ink-2">No saved resumes. Upload one instead.</p>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between border p-3 transition-colors ${
                  selectedResumeId === resume.id ? "border-ink bg-paper" : "border-rule hover:border-ink"
                }`}
              >
                <button type="button" onClick={() => onResumeSelect(resume.id)} className="flex-1 text-left">
                  <p className="text-sm font-medium text-ink">{resume.filename}</p>
                  <p className="text-xs text-ink-2">Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}</p>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${resume.filename}`}
                  onClick={() => handleDelete(resume.id)}
                  className="ml-2 text-ink-2 hover:text-miss-text"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {mode === "upload" && (
        <ResumeDropZone
          onFileSelect={onFileSelect}
          onClear={onFileClear}
          selectedFile={selectedFile}
          // Logged-in uploads are saved when used, and accounts keep one resume.
          note={
            resumes.length > 0
              ? "It will replace your saved resume when you run it."
              : "It will be saved to your account when you run it."
          }
        />
      )}
    </div>
  );
}
