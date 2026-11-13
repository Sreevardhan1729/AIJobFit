import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import MatchReport from "../components/MatchReport";
import type { JobResult } from "../types";

function Badge({ children, variant = "secondary", className = "" }: {
  children: React.ReactNode;
  variant?: "secondary" | "highlight";
  className?: string;
}) {
  const base = "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium shadow transition-colors";
  const variants = {
    secondary: "bg-gray-100 text-gray-700",
    highlight: "bg-gradient-to-r from-blue-600 to-violet-600 text-white",
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

function formatDescription(raw = ""): string {
  let html = raw.trim();
  if (!html) return "";
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>'
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
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-gray-600">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-rose-50 to-violet-50 p-4 md:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative isolate overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-lg"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-violet-500/20 blur-3xl" />
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              {job.logo_url ? (
                <img src={job.logo_url} alt="logo" className="h-14 w-14 rounded-xl object-cover shadow-lg" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow-lg">
                  {job.company?.[0] ?? "?"}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    {job.title}
                  </span>
                </h1>
                <p className="mt-1 text-gray-600">{job.company}</p>
              </div>
            </div>
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Apply Now
            </a>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur">
          <Badge>{job.site}</Badge>
          {job.location && <Badge>{job.location}</Badge>}
          {job.job_type && <Badge>{job.job_type}</Badge>}
          {job.date_posted && (
            <Badge>
              Posted {new Date(job.date_posted).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </Badge>
          )}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow">
          <button
            onClick={() => setShowDesc((v) => !v)}
            className="flex w-full items-center justify-between text-left text-lg font-medium text-gray-800"
          >
            Job Description
            {showDesc ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <AnimatePresence initial={false}>
            {showDesc && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="prose prose-sm mt-4 max-h-64 max-w-none overflow-y-auto pr-2 text-gray-600"
                dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
              />
            )}
          </AnimatePresence>
        </div>

        <MatchReport result={job.match} />

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/get_jobs")}
            className="rounded-lg bg-gray-300 px-12 py-3 text-sm text-gray-800 shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
