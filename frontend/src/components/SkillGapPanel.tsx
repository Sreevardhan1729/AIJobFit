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
    <div className="mx-auto mb-8 max-w-[700px] rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-1 text-lg font-semibold text-gray-800">Skills that would unlock the most of these jobs</h2>
      <p className="mb-4 text-xs text-gray-500">Click a skill to see only the jobs that ask for it.</p>
      <ul className="flex flex-wrap gap-2">
        {gaps.map((gap) => {
          const isSelected = selected === gap.key;
          return (
            <li key={gap.key}>
              <button
                type="button"
                onClick={() => onSelect(isSelected ? null : gap.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium shadow transition-colors ${
                  isSelected
                    ? "bg-indigo-500 text-white"
                    : "bg-rose-100 text-rose-700 ring-1 ring-rose-300 hover:ring-2"
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
