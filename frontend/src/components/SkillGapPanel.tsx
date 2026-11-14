import React from "react";
import type { JobResult } from "../types";
import { aggregateGaps } from "../lib/match";

interface SkillGapPanelProps {
  jobs: JobResult[];
  selected: string | null;
  onSelect: (key: string | null) => void;
}

export default function SkillGapPanel({ jobs, selected, onSelect }: SkillGapPanelProps) {
  const gaps = aggregateGaps(jobs);
  if (gaps.length === 0) return null;

  return (
    <div className="mx-auto mb-8 w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h2 className="mb-1 text-lg font-semibold text-slate-100">Skills that would unlock the most of these jobs</h2>
      <p className="mb-4 text-xs text-slate-400">Click a skill to see only the jobs that ask for it.</p>
      <ul className="flex flex-wrap gap-2">
        {gaps.map((gap) => {
          const isSelected = selected === gap.key;
          return (
            <li key={gap.key}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(isSelected ? null : gap.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition ${
                  isSelected
                    ? "bg-indigo-600 text-white ring-indigo-400"
                    : "bg-rose-950 text-rose-300 ring-rose-800/60 hover:ring-2"
                }`}
              >
                {gap.name} · missing in {gap.missingIn} of {gap.total}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
