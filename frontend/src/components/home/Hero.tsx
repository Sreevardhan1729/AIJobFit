import React from "react";
import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import Button from "../ui/Button";
import { GITHUB_URL } from "../Navbar";
import { projectStats } from "../../data/projectStats";

const PIPELINE: { title: string; note: string; tone: "plain" | "step" | "result" }[] = [
  { title: "Resume PDF", note: "+ job description", tone: "plain" },
  { title: "Custom spaCy NER", note: `trained · skills F1 ${projectStats.skillsF1}`, tone: "step" },
  { title: `${projectStats.skills}-skill dictionary`, note: "aliases · related skills", tone: "step" },
  { title: "Weighted score", note: "required ×2 · partial credit", tone: "step" },
  { title: "Explained result", note: "matched · partial · missing", tone: "result" },
];

const NODE_STYLE = {
  plain: "border-slate-700 bg-slate-900",
  step: "border-indigo-500/60 bg-indigo-950/60",
  result: "border-emerald-500/60 bg-emerald-950/60",
};

const STATS = [
  { value: String(projectStats.skills), label: "skills in the dictionary" },
  { value: String(projectStats.skillsF1), label: "skills F1 (custom-trained NER)" },
  { value: String(projectStats.backendTests), label: "backend tests" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">A FULL-STACK NLP PROJECT</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Resume-to-job matching that understands skills, not just keywords.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
          A custom-trained spaCy model and a {projectStats.skills}-skill dictionary pull the skills out of a resume
          and a job post, then score the fit and explain it, skill by skill.
        </p>

        <ol className="mt-10 flex flex-col items-stretch gap-2 md:flex-row md:items-center">
          {PIPELINE.map((node, index) => (
            <li key={node.title} className="flex flex-col items-center gap-2 md:flex-1 md:flex-row">
              <div className={`w-full rounded-xl border px-4 py-3 text-center md:text-left ${NODE_STYLE[node.tone]}`}>
                <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-100 md:justify-start">
                  {index === 0 && <FileText size={14} aria-hidden />}
                  {node.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{node.note}</p>
              </div>
              {index < PIPELINE.length - 1 && (
                <>
                  <ArrowDown size={16} aria-hidden className="shrink-0 text-slate-600 md:hidden" />
                  <ArrowRight size={16} aria-hidden className="hidden shrink-0 text-slate-600 md:block" />
                </>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-extrabold text-white">{stat.value}</dd>
                <dd className="text-sm text-slate-400">{stat.label}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            <Button to="/get_jobs">Find jobs for your resume</Button>
            <Button href="#try-it" variant="secondary">
              Try the demo
            </Button>
            <Button href={GITHUB_URL} variant="ghost">
              View on GitHub ↗
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
