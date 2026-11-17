import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Mark from "../ui/Mark";
import { projectStats } from "../../data/projectStats";

const PIPELINE = [
  { title: "Read the PDF", note: "the resume's text, plus the job description" },
  { title: "Tag skills with a custom spaCy model", note: `tok2vec + NER · skills F1 ${projectStats.skillsF1}` },
  { title: `Catch misses with a ${projectStats.skills}-skill dictionary`, note: "aliases and related skills" },
  { title: "Score and explain", note: "required skills count double, close ones earn half" },
];

const TEXT_BUTTON = "text-sm font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink";

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
      <>
        <span className="text-ink-2">Found in the job:</span> <b className="font-semibold">MediaPipe</b>,{" "}
        <b className="font-semibold">Dlib</b> and <b className="font-semibold">Collaborative Filtering</b>
      </>
    ),
  },
  {
    title: "Normalize",
    body: "Aliases and spellings collapse to one canonical name, without merging look-alikes.",
    example: (
      <ul className="space-y-1">
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
    example: (
      <>
        <Mark kind="close">TensorFlow</Mark> <span className="text-ink-2">via PyTorch</span> earns half credit
      </>
    ),
  },
];

export default function HowItWorks() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          id="how-it-works"
          title="Skills, not just keywords"
          subtitle={`A custom-trained spaCy model and a ${projectStats.skills}-skill dictionary pull the skills out of a resume and a job post, then score the fit and explain it, skill by skill.`}
        />

        <ol className="grid gap-x-8 gap-y-6 border-t border-ink pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, index) => (
            <li key={step.title}>
              <p className="font-serif text-3xl font-medium leading-none text-ink">{index + 1}</p>
              <p className="mt-3 font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-ink-2">{step.note}</p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          aria-expanded={showDetails}
          aria-controls="how-it-works-details"
          onClick={() => setShowDetails((open) => !open)}
          className={`mt-8 inline-flex items-center gap-1 ${TEXT_BUTTON}`}
        >
          Technical details
          <ChevronDown size={14} aria-hidden className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </button>

        {showDetails && (
          <div id="how-it-works-details" className="mt-6">
            <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              {STEPS.map((step, index) => (
                <li key={step.title} className="border-t border-rule pt-5">
                  <p className="text-sm text-ink-2">Stage {index + 1}</p>
                  <h3 className="mt-1 font-serif text-xl font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
                  <div className="mt-4 border-l-2 border-rule pl-4 text-sm leading-relaxed text-ink">{step.example}</div>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-l-2 border-ink pl-4 text-sm text-ink">
              The score is an estimate from skill overlap, not an employer's ATS score, and not hiring odds.
              Experience is estimated from resume dates and never changes the score.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
