import React, { useState, useEffect } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import type { Resume } from "../types";
import ResumeDropZone from "./ResumeDropZone";

interface ResumeSelectorProps {
  onResumeSelect: (resumeId: string) => void;
  onFileSelect: (file: File) => void;
  selectedResumeId?: string;
  selectedFile?: File | null;
}

const TAB = "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition";

export default function ResumeSelector({
  onResumeSelect,
  onFileSelect,
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
    return <ResumeDropZone onFileSelect={onFileSelect} selectedFile={selectedFile} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("saved")}
          className={`${TAB} ${mode === "saved" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          <FileText size={14} aria-hidden />
          Saved resume
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`${TAB} ${mode === "upload" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          <Upload size={14} aria-hidden />
          Upload new
        </button>
      </div>

      {mode === "saved" && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : resumes.length === 0 ? (
            <p className="text-sm text-slate-400">No saved resumes. Upload one instead.</p>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition ${
                  selectedResumeId === resume.id
                    ? "border-indigo-400 bg-indigo-950/50"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <button type="button" onClick={() => onResumeSelect(resume.id)} className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-100">{resume.filename}</p>
                  <p className="text-xs text-slate-400">Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}</p>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${resume.filename}`}
                  onClick={() => handleDelete(resume.id)}
                  className="ml-2 text-slate-400 hover:text-rose-300"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {mode === "upload" && <ResumeDropZone onFileSelect={onFileSelect} selectedFile={selectedFile} />}
    </div>
  );
}
