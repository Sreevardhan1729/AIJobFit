import React, { useState } from "react";
import { ArrowDown, ArrowRight, ChevronDown, FileText, Info } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Chip from "../ui/Chip";
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

// Stages 1, 2 and 4 show real output for the sample job (see scripts/build_sample.py);
// the C# case in stage 3 is from the matching engine's tests.
const STEPS: { title: string; body: string; example: React.ReactNode }[] = [
  {
    title: "Find skills",
    body: "A custom-trained spaCy model (tok2vec + NER) tags skills in the resume and the job post.",
    example: (
      <>
        On the sample job it tagged <q>ML</q>, <q>Machine Learning</q> and <q>machine learning</q> as three
        different skills, and missed Mediapipe, Dlib and Collaborative Filtering.
      </>
    ),
  },
  {
    title: "Catch what the model misses",
    body: `A ${projectStats.skills}-skill dictionary is scanned too, longest match first. Ambiguous words like “Go” or “Swift” are never scanned.`,
    example: (
      <span className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-slate-400">Found in the job:</span>
        <Chip tone="brand">MediaPipe</Chip>
        <Chip tone="brand">Dlib</Chip>
        <Chip tone="brand">Collaborative Filtering</Chip>
      </span>
    ),
  },
  {
    title: "Normalize",
    body: "Aliases and spellings collapse to one canonical name, without merging look-alikes.",
    example: (
      <ul className="space-y-1 font-mono text-xs">
        <li>ML / machine learning → Machine Learning</li>
        <li>sklearn → Scikit-learn</li>
        <li>C# stays C# (spaCy splits it into “C” + “#”)</li>
      </ul>
    ),
  },
  {
    title: "Score & explain",
    body:
      "Required skills are worth 1 and preferred ½, detected from section headings and cues like “nice to have”. " +
      "Closely related skills earn half credit. The score is earned ÷ total, rounded the same on the server and in the browser.",
    example: <Chip tone="partial">TensorFlow · via PyTorch</Chip>,
  },
];

export default function HowItWorks() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="border-t border-slate-800/70 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          id="how-it-works"
          eyebrow="How it works"
          title="Skills, not just keywords"
          subtitle={`A custom-trained spaCy model and a ${projectStats.skills}-skill dictionary pull the skills out of a resume and a job post, then score the fit and explain it, skill by skill.`}
        />

        <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
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

        <button
          type="button"
          aria-expanded={showDetails}
          aria-controls="how-it-works-details"
          onClick={() => setShowDetails((open) => !open)}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          Technical details
          <ChevronDown size={14} aria-hidden className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </button>

        {showDetails && (
          <div id="how-it-works-details" className="mt-6">
            <ol className="grid gap-4 md:grid-cols-2">
              {STEPS.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <p className="text-xs font-semibold text-indigo-300">Stage {index + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                    {step.example}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-3 text-sm text-slate-300">
              <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-indigo-300" />
              The score is an estimate from skill overlap — not an employer's ATS score, and not hiring odds.
              Experience is estimated from resume dates and never changes the score.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
