import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ExternalLink } from "lucide-react";
import MatchReport from "../components/MatchReport";
import { plainJobText } from "../lib/markup";
import { readStorage, removeStorage } from "../lib/storage";
import type { JobResult } from "../types";

function formatDescription(raw = ""): string {
  let html = raw.trim();
  if (!html) return "";
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="underline">$1</a>'
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
    const raw = readStorage(`handoff:${id}`);
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
    if (id) removeStorage(`handoff:${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-ink-2">Loading job details...</p>
      </div>
    );
  }

  const posted = job.date_posted
    ? `Posted ${new Date(job.date_posted).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
    : null;
  const meta = [job.site, job.location, job.job_type, posted].filter(Boolean).join(" · ");
  const description = job.description?.trim() ?? "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col justify-between gap-6 border-b border-ink pb-6 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="text-ink-2">{job.company}</p>
          <h1 className="mt-1 font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">{job.title}</h1>
          {meta && <p className="mt-2 text-sm text-ink-2">{meta}</p>}
        </div>
        <a
          href={job.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-ink-2"
        >
          Apply now <ExternalLink size={14} aria-hidden />
        </a>
      </div>

      <div className="mt-8">
        {job.match ? (
          // The post appears once: marked up inside the report, open, so it follows the what-if marks.
          <MatchReport result={job.match} jobText={plainJobText(description)} jobTextOpen />
        ) : (
          <>
            <div className="border border-rule bg-sheet p-6 text-sm text-ink-2">
              Match details aren't available for this job.
            </div>
            {description && (
              <div className="mt-4 border border-rule bg-sheet px-5">
                <button
                  type="button"
                  aria-expanded={showDesc}
                  onClick={() => setShowDesc((v) => !v)}
                  className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-ink"
                >
                  Job description
                  <ChevronDown size={16} aria-hidden className={`text-ink-2 transition-transform ${showDesc ? "rotate-180" : ""}`} />
                </button>
                {showDesc && (
                  <div
                    className="max-h-96 space-y-3 overflow-y-auto pb-4 pr-2 text-sm leading-7 text-ink"
                    dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => navigate("/get_jobs")}
          className="text-sm font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
        >
          ← Back to job search
        </button>
      </div>
    </div>
  );
}
