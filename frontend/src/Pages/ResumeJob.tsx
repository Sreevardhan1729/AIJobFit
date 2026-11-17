import React, { useState } from "react";
import * as api from "../api";
import MatchReport from "../components/MatchReport";
import ResumeSelector from "../components/ResumeSelector";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { FIELD, LABEL } from "../components/ui/fieldStyles";
import { loadSampleResumeFile } from "../data/loadSampleResume";
import { SAMPLE_JOB_TEXT } from "../data/sampleJob";
import type { MatchResult } from "../types";

export default function ResumeJob() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [jobDescription, setJobDescription] = useState("");
  // While the sample resume is the selected file, runs must not attach the visitor's login, or the
  // backend saves the sample as their resume. Only picking another resume clears this; editing the
  // job text doesn't change which file is sent.
  const [usingSample, setUsingSample] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [submittedJob, setSubmittedJob] = useState(""); // the text the shown result was computed from

  const trySample = async () => {
    setError("");
    try {
      const file = await loadSampleResumeFile();
      setResumeFile(file);
      setResumeId(undefined);
      setJobDescription(SAMPLE_JOB_TEXT);
      setUsingSample(true);
    } catch {
      setError("Couldn't load the sample resume. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!resumeFile && !resumeId) {
      setError("Please upload a resume PDF or select a saved one.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);
    try {
      const options = usingSample ? { anonymous: true } : undefined;
      const data = await api.getMatch(resumeFile, jobDescription, resumeId, options);
      setResult(data);
      setSubmittedJob(jobDescription);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error fetching comparison");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl font-medium text-ink">Compare a resume with a job</h1>
      <p className="mt-3 max-w-2xl text-ink-2">
        See which of the job's skills your resume already covers, which are close, and which are missing.
      </p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={`${LABEL} mb-0`}>Resume</span>
              <button
                type="button"
                onClick={trySample}
                className="text-sm font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
              >
                Try the sample
              </button>
            </div>
            <ResumeSelector
              onResumeSelect={(id) => {
                setResumeId(id);
                setResumeFile(null);
                setUsingSample(false);
              }}
              onFileSelect={(file) => {
                setResumeFile(file);
                setResumeId(undefined);
                setUsingSample(false);
              }}
              selectedResumeId={resumeId}
              onFileClear={() => {
                setResumeFile(null);
                setUsingSample(false);
              }}
              selectedFile={resumeFile}
            />
          </div>

          <div>
            <label htmlFor="job-description" className={LABEL}>
              Job description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the job description here"
              className={`${FIELD} leading-relaxed`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={loading}>
              Compare skills
            </Button>
            {error && <p className="text-sm text-miss-text">{error}</p>}
          </div>
        </form>
      </Card>

      {result && (
        <div className="mt-8">
          <MatchReport result={result} jobText={submittedJob} />
        </div>
      )}
    </div>
  );
}
