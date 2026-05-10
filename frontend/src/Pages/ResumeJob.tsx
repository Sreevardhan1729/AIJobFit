import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import ResumeSelector from "../components/ResumeSelector";

export default function ResumeJob() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<[string[], string[]] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!resumeFile && !resumeId) {
      setError("Please upload a resume PDF or select a saved one.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a Job Description.");
      return;
    }

    try {
      const data = await api.getComparison(resumeFile, jobDescription, resumeId);
      setResult(data);
      setSubmitted(true);
    } catch {
      setError("Error fetching comparison");
    }
  };

  return (
    <div className="mx-auto max-w-screen-md px-4 py-20">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Job Skill Comparison</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ResumeSelector
          onResumeSelect={(id) => { setResumeId(id); setResumeFile(null); }}
          onFileSelect={(file) => { setResumeFile(file); setResumeId(undefined); }}
          selectedResumeId={resumeId}
          selectedFile={resumeFile}
        />

        <div>
          <label className="mb-2 block font-medium text-gray-700">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the Job Description Here"
            className="w-full rounded border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            style={{ minHeight: "100px", maxHeight: "300px", overflowY: "auto" }}
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded bg-indigo-500 px-6 py-2 text-white shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Compare Skills
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {submitted && result && (
        <div className="mt-8 space-y-6">
          {result[0] && result[0].length > 0 ? (
            <div>
              <h3 className="mb-2 text-xl font-semibold text-green-600">Skills in Common</h3>
              <ul className="list-inside list-disc text-gray-700">
                {result[0].map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          ) : (
            <h3 className="mb-2 text-xl font-semibold text-orange-500">No Skills are Common</h3>
          )}

          {result[1] && result[1].length > 0 ? (
            <div>
              <h3 className="mb-2 text-xl font-semibold text-red-600">Skills Need to be Added</h3>
              <ul className="list-inside list-disc text-gray-700">
                {result[1].map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          ) : (
            <h3 className="mb-2 text-xl font-semibold text-green-600">All Skills Already Present</h3>
          )}
        </div>
      )}

      <button
        className="mt-8 inline-flex items-center rounded bg-gray-300 px-6 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
