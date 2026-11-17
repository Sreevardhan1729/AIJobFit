import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Mark, { bandMark } from "../ui/Mark";
import MarkedText, { MarkLegend } from "../MarkedText";
import { matchLabel } from "../../lib/match";
import { SAMPLE_JOB_TEXT } from "../../data/sampleJob";
import SAMPLE_MATCH from "../../data/sampleMatch.json";
import type { MatchResult } from "../../types";

const SNAPSHOT = SAMPLE_MATCH as MatchResult;
const BAND = matchLabel(SNAPSHOT.score);

// Four requirement lines from the sample job that show every kind of mark, taken from the real text.
const LINES = SAMPLE_JOB_TEXT.split("\n");
const FIRST = LINES.findIndex((line) => line.startsWith("Strong knowledge"));
const EXCERPT = LINES.slice(FIRST, FIRST + 4).join("\n\n");

const TEXT_LINK = "font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-6 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <div>
        <h1 className="font-serif text-4xl font-medium leading-[1.08] text-ink sm:text-5xl">
          See how well your resume fits a job, and find jobs that fit it.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
          Upload a resume. AIJobFit reads the skills in it and in the job post, scores the fit, and marks up what's
          missing.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button to="/get_jobs" className="px-5 py-3 text-base">
            Find jobs for your resume
          </Button>
          <Button href="#try-it" variant="secondary" className="px-5 py-3 text-base">
            Try a quick demo
          </Button>
        </div>
        <p className="mt-4 text-sm text-ink-2">
          or{" "}
          <Link to="/resume_job" className={TEXT_LINK}>
            compare with one job
          </Link>{" "}
          ·{" "}
          <Link to="/job" className={TEXT_LINK}>
            analyze a job post
          </Link>
        </p>
      </div>

      <figure aria-label="Sample job, marked up" className="border border-rule bg-sheet p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-rule-soft pb-3">
          <p className="font-serif text-lg font-semibold text-ink">AI/ML Engineer · sample</p>
          <div className="border-l border-rule pl-4 text-right">
            <p className="font-serif text-3xl font-medium leading-none text-ink">{SNAPSHOT.score}%</p>
            {BAND && (
              <Mark kind={bandMark(BAND.tone)} className="mt-1.5 inline-block text-xs font-semibold">
                {BAND.label}
              </Mark>
            )}
          </div>
        </div>
        <div className="mt-4 text-[15px] leading-7 text-ink">
          <MarkedText text={EXCERPT} skills={SNAPSHOT.skills} />
        </div>
        <MarkLegend className="mt-4 border-t border-rule-soft pt-3" />
      </figure>
    </section>
  );
}
