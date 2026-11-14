import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { JobResult } from "../types";
import { matchLabel, skillPreview } from "../lib/match";
import Chip from "./ui/Chip";

interface JobCardProps {
  job: JobResult;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  const handleDetails = () => {
    localStorage.setItem(`handoff:${job.id}`, JSON.stringify(job));
    window.open(`/get_jobs/${job.id}`, "_blank", "noopener,noreferrer");
  };

  const score = job.match?.score ?? job.similarity_score ?? null;
  const label = matchLabel(score);
  const preview = job.match ? skillPreview(job.match.skills) : { matches: [], missing: [] };
  const posted = job.date_posted
    ? new Date(job.date_posted).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;
  const meta = [job.site, job.job_type, posted && `Posted ${posted}`].filter(Boolean).join(" · ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-100">{job.title}</h2>
          <p className="text-sm text-slate-400">{[job.company, job.location].filter(Boolean).join(" · ")}</p>
          {meta && <p className="text-xs text-slate-400">{meta}</p>}
        </div>
        {label && score !== null && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-2xl font-bold text-slate-100">{score}%</span>
            <Chip tone={label.tone}>{label.label}</Chip>
          </div>
        )}
      </div>

      {(preview.matches.length > 0 || preview.missing.length > 0) && (
        <div className="mt-4 space-y-1 text-sm">
          {preview.matches.length > 0 && <p className="text-emerald-300">Matches: {preview.matches.join(", ")}</p>}
          {preview.missing.length > 0 && <p className="text-rose-300">Missing: {preview.missing.join(", ")}</p>}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDetails}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800"
        >
          More details
        </button>
        <a
          href={job.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Apply <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    </motion.div>
  );
}
