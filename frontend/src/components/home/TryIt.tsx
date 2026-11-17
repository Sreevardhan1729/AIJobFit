import React, { useState } from "react";
import * as api from "../../api";
import MatchReport from "../MatchReport";
import ResumeDropZone from "../ResumeDropZone";
import Button from "../ui/Button";
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

const TAB = "border-b-2 pb-1 text-sm transition-colors";
const TEXT_BUTTON = "text-sm font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink";

export default function TryIt() {
  const [choice, setChoice] = useState<ResumeChoice>("sample");
  const [ownFile, setOwnFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState(SAMPLE_JOB_TEXT);
  const [showSample, setShowSample] = useState(false);
  const [result, setResult] = useState<MatchResult>(SNAPSHOT);
  const [resultJobText, setResultJobText] = useState(SAMPLE_JOB_TEXT); // the text that produced `result`
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
      setResultJobText(jobText);
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
    setResultJobText(SAMPLE_JOB_TEXT);
    setKind("sample");
    setRunId((id) => id + 1);
    setStatus("idle");
    setError("");
  };

  const note =
    status === "running"
      ? "The free server can take up to a minute to wake up."
      : status === "failed"
        ? "The live server is waking up. Try again in a moment."
        : "";

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="try-it"
        title="Try it on a sample resume"
        subtitle="Edit the job, or switch to your own resume, then run it. Nothing here is saved."
      />

      <div className="grid border border-rule bg-sheet lg:grid-cols-2">
        <div className="p-5 sm:p-6 lg:border-r lg:border-rule">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <span className={`${LABEL} mb-0`}>Resume</span>
            <div className="flex gap-5">
              <button
                type="button"
                aria-pressed={choice === "sample"}
                onClick={() => setChoice("sample")}
                className={`${TAB} ${choice === "sample" ? "border-ink font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
              >
                Sample resume
              </button>
              <button
                type="button"
                aria-pressed={choice === "own"}
                onClick={() => setChoice("own")}
                className={`${TAB} ${choice === "own" ? "border-ink font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
              >
                Use my resume
              </button>
            </div>
          </div>

          {choice === "sample" ? (
            <div className="border border-rule-soft p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">Jane Doe, ML engineer</p>
                  <p className="text-xs text-ink-2">Fictional sample resume</p>
                </div>
                <button
                  type="button"
                  aria-expanded={showSample}
                  onClick={() => setShowSample((open) => !open)}
                  className={TEXT_BUTTON}
                >
                  {showSample ? "Hide" : "View"}
                </button>
              </div>
              {showSample && (
                <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap border-t border-rule-soft pt-4 font-sans text-xs leading-relaxed text-ink">
                  {SAMPLE_RESUME_TEXT}
                </pre>
              )}
            </div>
          ) : (
            <ResumeDropZone
              onFileSelect={setOwnFile}
              onClear={() => setOwnFile(null)}
              note="Used for this match only, not saved."
              selectedFile={ownFile}
              hint="PDF only · used for this match, not saved"
            />
          )}
        </div>

        <div className="border-t border-rule p-5 sm:p-6 lg:border-t-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <label htmlFor="try-job" className={`${LABEL} mb-0`}>
              Job description
            </label>
            {!(usingSampleInputs && kind === "sample") && (
              <button type="button" onClick={reset} className={TEXT_BUTTON}>
                Reset to sample
              </button>
            )}
          </div>
          <textarea
            id="try-job"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={6}
            placeholder="Paste a job description here"
            className={`${FIELD} leading-relaxed`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={run} loading={status === "running"}>
          {status === "running" ? "Running…" : "Run match"}
        </Button>
        {error ? (
          <span className="text-sm text-miss-text">{error}</span>
        ) : (
          note && <span className="text-sm text-ink-2">{note}</span>
        )}
      </div>

      <div className="mt-10">
        <p className="mb-3 text-sm font-semibold text-ink-2">{RESULT_LABEL[kind]}</p>
        <MatchReport key={runId} result={result} jobText={resultJobText} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-2">
        Ready for real jobs?
        <Button to="/get_jobs" variant="secondary">
          Find jobs that fit your resume →
        </Button>
      </div>
    </section>
  );
}
