import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Chip from "../ui/Chip";
import { projectStats } from "../../data/projectStats";

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
  return (
    <section className="border-t border-slate-800/70 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          id="how-it-works"
          eyebrow="How it works"
          title="Four stages, each fixing what the last one gets wrong"
        />
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
      </div>
    </section>
  );
}
