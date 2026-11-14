import React, { useState } from "react";
import { FileText, Play, RotateCcw } from "lucide-react";
import * as api from "../../api";
import MatchReport from "../MatchReport";
import ResumeDropZone from "../ResumeDropZone";
import Button from "../ui/Button";
import Card from "../ui/Card";
import SectionHeading from "../ui/SectionHeading";
import { FIELD, LABEL } from "../ui/fieldStyles";
import { loadSampleResumeFile } from "../../data/loadSampleResume";
import { SAMPLE_JOB_TEXT } from "../../data/sampleJob";
import { SAMPLE_RESUME_TEXT } from "../../data/sampleResume";
import SAMPLE_MATCH from "../../data/sampleMatch.json";
import type { MatchResult } from "../../types";

// A real /match response for the two samples, captured by scripts/build_sample.py.
const SNAPSHOT = SAMPLE_MATCH as MatchResult;

type ResumeChoice = "sample" | "own";
type ResultKind = "sample" | "live" | "yours";
type RunStatus = "idle" | "running" | "failed";

const RESULT_LABEL: Record<ResultKind, string> = {
  sample: "Sample result",
  live: "Live result",
  yours: "Your result",
};

const SEGMENT = "rounded-lg px-3 py-1.5 text-sm font-medium transition";

export default function TryIt() {
  const [choice, setChoice] = useState<ResumeChoice>("sample");
  const [ownFile, setOwnFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState(SAMPLE_JOB_TEXT);
  const [showSample, setShowSample] = useState(false);
  const [result, setResult] = useState<MatchResult>(SNAPSHOT);
  const [kind, setKind] = useState<ResultKind>("sample");
  const [runId, setRunId] = useState(0); // remounts the report so what-if marks reset per result
  const [status, setStatus] = useState<RunStatus>("idle");
  const [error, setError] = useState("");

  const usingSampleInputs = choice === "sample" && jobText === SAMPLE_JOB_TEXT;

  const run = async () => {
    setError("");
    if (choice === "own" && !ownFile) {
      setError("Choose a PDF resume first.");
      return;
    }
    if (!jobText.trim()) {
      setError("Paste a job description first.");
      return;
    }
    const isSampleRun = usingSampleInputs;
    setStatus("running");
    try {
      const resume = choice === "own" && ownFile ? ownFile : await loadSampleResumeFile();
      // Always anonymous: nothing run from the home page is saved to an account.
      const live = await api.getMatch(resume, jobText, undefined, { anonymous: true });
      setResult(live);
      setKind(isSampleRun ? "live" : "yours");
      setRunId((id) => id + 1);
      setStatus("idle");
    } catch {
      setStatus("failed");
    }
  };

  const reset = () => {
    setChoice("sample");
    setOwnFile(null);
    setJobText(SAMPLE_JOB_TEXT);
    setResult(SNAPSHOT);
    setKind("sample");
    setRunId((id) => id + 1);
    setStatus("idle");
    setError("");
  };

  const note =
    status === "running"
      ? "The free server can take up to a minute to wake up."
      : status === "failed"
        ? "The live server is waking up — try again in a moment."
        : usingSampleInputs
          ? "Edit the job description or use your own resume to get a different result."
          : "";

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="try-it"
        eyebrow="Try it"
        title="Run a match on the sample, or on your own resume"
        subtitle="Edit the job description, swap in your resume, and run it. Nothing here is saved to an account."
      />

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className={`${LABEL} mb-0`}>Resume</span>
            <div className="flex gap-1 rounded-xl bg-slate-950/70 p-1">
              <button
                type="button"
                aria-pressed={choice === "sample"}
                onClick={() => setChoice("sample")}
                className={`${SEGMENT} ${choice === "sample" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Sample resume
              </button>
              <button
                type="button"
                aria-pressed={choice === "own"}
                onClick={() => setChoice("own")}
                className={`${SEGMENT} ${choice === "own" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Use my resume
              </button>
            </div>
          </div>

          {choice === "sample" ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-indigo-950 p-2 text-indigo-300">
                    <FileText size={18} aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-100">Jane Doe — ML engineer</p>
                    <p className="text-xs text-slate-400">Fictional sample resume</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-expanded={showSample}
                  onClick={() => setShowSample((open) => !open)}
                  className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
                >
                  {showSample ? "Hide" : "View"}
                </button>
              </div>
              {showSample && (
                <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950/70 p-4 font-sans text-xs leading-relaxed text-slate-300">
                  {SAMPLE_RESUME_TEXT}
                </pre>
              )}
            </div>
          ) : (
            <ResumeDropZone
              onFileSelect={setOwnFile}
              selectedFile={ownFile}
              hint="PDF only · used for this match, not saved"
            />
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor="try-job" className={`${LABEL} mb-0`}>
              Job description
            </label>
            {!(usingSampleInputs && kind === "sample") && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200"
              >
                <RotateCcw size={14} aria-hidden />
                Reset to sample
              </button>
            )}
          </div>
          <textarea
            id="try-job"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={10}
            placeholder="Paste a job description here"
            className={`${FIELD} leading-relaxed`}
          />
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={run} loading={status === "running"}>
          {status !== "running" && <Play size={16} aria-hidden />}
          {status === "running" ? "Running…" : "Run match"}
        </Button>
        {error ? (
          <span className="text-sm text-rose-300">{error}</span>
        ) : (
          note && <span className="text-sm text-slate-400">{note}</span>
        )}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{RESULT_LABEL[kind]}</p>
        <MatchReport key={runId} result={result} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-500/40 bg-indigo-950/40 p-5">
        <p className="flex-1 text-sm text-slate-300">
          Ready for real jobs? Upload your resume and get fresh LinkedIn and Indeed postings ranked by fit.
        </p>
        <Button to="/get_jobs">Find jobs that fit your resume →</Button>
      </div>
    </section>
  );
}
