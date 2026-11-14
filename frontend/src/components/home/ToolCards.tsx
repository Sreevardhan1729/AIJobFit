import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileSearch, Scale, Search } from "lucide-react";

const CARDS = [
  {
    to: "/get_jobs",
    title: "Job search",
    body: "Upload your resume and get fresh LinkedIn and Indeed jobs, ranked by how well you fit.",
    cta: "Find jobs",
    Icon: Search,
    featured: true,
  },
  {
    to: "/resume_job",
    title: "Compare",
    body: "Check your resume against one job description, skill by skill.",
    cta: "Compare",
    Icon: Scale,
    featured: false,
  },
  {
    to: "/job",
    title: "Analyze",
    body: "Break a job description into required and preferred skills, experience and education.",
    cta: "Analyze",
    Icon: FileSearch,
    featured: false,
  },
];

export default function ToolCards() {
  return (
    <section aria-label="Tools" className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <ul className="grid gap-4 md:grid-cols-3">
        {CARDS.map(({ to, title, body, cta, Icon, featured }) => (
          <li key={to}>
            <Link
              to={to}
              className={`group flex h-full flex-col rounded-2xl border p-6 transition hover:-translate-y-0.5 ${
                featured
                  ? "border-indigo-500/60 bg-indigo-950/50 hover:border-indigo-400"
                  : "border-slate-800 bg-slate-900/80 hover:border-slate-600"
              }`}
            >
              <span className="flex items-center gap-2 text-base font-semibold text-slate-100">
                <Icon size={18} aria-hidden className="text-indigo-300" />
                {title}
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{body}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-300 group-hover:text-indigo-200">
                {cta} <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
