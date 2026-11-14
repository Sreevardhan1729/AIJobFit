import React from "react";
import { Info } from "lucide-react";

export default function HonestyStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-indigo-300" />
        <p>
          The score is an estimate from skill overlap — not an employer's ATS score, and not hiring odds. Experience
          is estimated from resume dates and never changes the score.
        </p>
      </div>
    </section>
  );
}
