import React from "react";
import { ExternalLink } from "lucide-react";
import type { JobResult } from "../types";
import { matchLabel, skillPreview } from "../lib/match";
import { writeStorage } from "../lib/storage";
import Mark, { bandMark } from "./ui/Mark";
import type { MarkKind } from "./ui/Mark";

interface JobCardProps {
  job: JobResult;
}

function MarkedList({ label, names, kind }: { label: string; names: string[]; kind: MarkKind }) {
  return (
    <p>
      {label}:{" "}
      {names.map((name, i) => (
        <React.Fragment key={name}>
          {i > 0 && ", "}
          <Mark kind={kind} className="text-ink">{name}</Mark>
        </React.Fragment>
      ))}
    </p>
  );
}

export default function JobCard({ job }: JobCardProps) {
  const handleDetails = () => {
    writeStorage(`handoff:${job.id}`, JSON.stringify(job));
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
    <article className="w-full max-w-4xl border border-rule bg-sheet p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="line-clamp-2 font-serif text-xl font-medium leading-snug text-ink">{job.title}</h2>
          <p className="text-sm text-ink-2">{[job.company, job.location].filter(Boolean).join(" · ")}</p>
          {meta && <p className="text-xs text-ink-2">{meta}</p>}
        </div>
        {label && score !== null && (
          <div className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-end sm:gap-1.5">
            <span className="font-serif text-3xl font-medium leading-none text-ink">{score}%</span>
            <Mark kind={bandMark(label.tone)} className="text-xs font-semibold">
              {label.label}
            </Mark>
          </div>
        )}
      </div>

      {(preview.matches.length > 0 || preview.missing.length > 0) && (
        <div className="mt-4 space-y-1 border-t border-rule-soft pt-3 text-sm text-ink-2">
          {preview.matches.length > 0 && <MarkedList label="Matches" names={preview.matches} kind="have" />}
          {preview.missing.length > 0 && <MarkedList label="Missing" names={preview.missing} kind="miss" />}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDetails}
          className="rounded-[3px] border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
        >
          More details
        </button>
        <a
          href={job.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[3px] bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink-2"
        >
          Apply <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    </article>
  );
}
