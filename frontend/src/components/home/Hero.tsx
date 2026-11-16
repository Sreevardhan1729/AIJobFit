import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const TEXT_LINK = "font-medium text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">A FULL-STACK NLP PROJECT</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          See how well your resume fits a job, and find jobs that fit it.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
          Upload a resume. AIJobFit pulls out the skills, scores the fit and shows what's missing.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button to="/get_jobs" className="px-5 py-3 text-base">
            Find jobs for your resume
          </Button>
          <Button href="#try-it" variant="secondary" className="px-5 py-3 text-base">
            Try a quick demo
          </Button>
        </div>
        <p className="mt-4 text-sm text-slate-400">
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
    </section>
  );
}
