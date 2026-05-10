import React, { useState, useEffect } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import type { Resume } from "../types";

interface ResumeSelectorProps {
  onResumeSelect: (resumeId: string) => void;
  onFileSelect: (file: File) => void;
  selectedResumeId?: string;
  selectedFile?: File | null;
}

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
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Upload Resume (PDF):</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          className="w-full cursor-pointer text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-600"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("saved")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "saved"
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FileText size={14} className="mr-1 inline" />
          Saved Resume
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "upload"
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Upload size={14} className="mr-1 inline" />
          Upload New
        </button>
      </div>

      {mode === "saved" && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : resumes.length === 0 ? (
            <p className="text-sm text-gray-500">No saved resumes. Upload one below.</p>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between rounded-lg border p-3 transition ${
                  selectedResumeId === resume.id
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onResumeSelect(resume.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-medium text-gray-800">{resume.filename}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(resume.id)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {mode === "upload" && (
        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
            className="w-full cursor-pointer text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-600"
          />
          {selectedFile && (
            <p className="mt-1 text-xs text-gray-500">Selected: {selectedFile.name}</p>
          )}
        </div>
      )}
    </div>
  );
}
