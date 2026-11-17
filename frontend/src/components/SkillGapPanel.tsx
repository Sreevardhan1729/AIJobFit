import React from "react";
import type { JobResult } from "../types";
import { aggregateGaps } from "../lib/match";
import Mark from "./ui/Mark";

interface SkillGapPanelProps {
  jobs: JobResult[];
  selected: string | null;
  onSelect: (key: string | null) => void;
}

export default function SkillGapPanel({ jobs, selected, onSelect }: SkillGapPanelProps) {
  const gaps = aggregateGaps(jobs);
  if (gaps.length === 0) return null;

  return (
    <div className="mx-auto mb-8 w-full max-w-3xl border border-rule bg-sheet p-6">
      <h2 className="mb-1 font-serif text-xl font-medium text-ink">Skills that would unlock the most of these jobs</h2>
      <p className="mb-4 text-sm text-ink-2">Click a skill to see only the jobs that ask for it.</p>
      <ul className="flex flex-wrap gap-2">
        {gaps.map((gap) => {
          const isSelected = selected === gap.key;
          return (
            <li key={gap.key}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(isSelected ? null : gap.key)}
                className={`rounded-[3px] border px-2.5 py-1 text-sm transition-colors ${
                  isSelected ? "border-ink bg-ink text-white" : "border-rule bg-sheet text-ink hover:border-ink"
                }`}
              >
                {isSelected ? gap.name : <Mark kind="miss">{gap.name}</Mark>}
                <span className={isSelected ? "" : "text-ink-2"}> · missing in {gap.missingIn} of {gap.total}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
