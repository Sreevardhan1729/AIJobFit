import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import MatchReport from "../components/MatchReport";
import Chip from "../components/ui/Chip";
import type { JobResult } from "../types";

function formatDescription(raw = ""): string {
  let html = raw.trim();
  if (!html) return "";
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-300 underline">$1</a>'
    )
    .replace(/\n\s*\n/g, "</p><p>")
    .replace(/\n/g, "<br />");
  return `<p>${html}</p>`;
}

export default function JobDetailsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();
  const jobFromState = (state as { job?: JobResult })?.job;

  const jobFromStorage = (() => {
    if (!id) return null;
    const raw = localStorage.getItem(`handoff:${id}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed.id?.toString() === id ? parsed : null;
    } catch {
      return null;
    }
  })();

  const [job] = useState<JobResult | null>(jobFromState || jobFromStorage || null);
  const [showDesc, setShowDesc] = useState(true);

  React.useEffect(() => {
    if (id) localStorage.removeItem(`handoff:${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-sm text-slate-400">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            {job.logo_url ? (
              <img src={job.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                {job.company?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{job.title}</h1>
              <p className="mt-1 text-slate-400">{job.company}</p>
            </div>
          </div>
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Apply now <ExternalLink size={14} aria-hidden />
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip tone="neutral">{job.site}</Chip>
          {job.location && <Chip tone="neutral">{job.location}</Chip>}
          {job.job_type && <Chip tone="neutral">{job.job_type}</Chip>}
          {job.date_posted && (
            <Chip tone="neutral">
              Posted{" "}
              {new Date(job.date_posted).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </Chip>
          )}
        </div>
      </motion.div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <button
          type="button"
          aria-expanded={showDesc}
          onClick={() => setShowDesc((v) => !v)}
          className="flex w-full items-center justify-between text-left text-lg font-semibold text-slate-100"
        >
          Job description
          {showDesc ? <ChevronUp size={20} aria-hidden /> : <ChevronDown size={20} aria-hidden />}
        </button>
        <AnimatePresence initial={false}>
          {showDesc && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-300"
              dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6">
        {job.match ? (
          <MatchReport result={job.match} />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
            Match details aren't available for this job.
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/get_jobs")}
          className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-2.5 text-sm text-slate-100 hover:bg-slate-800"
        >
          Back to job search
        </button>
      </div>
    </div>
  );
}
