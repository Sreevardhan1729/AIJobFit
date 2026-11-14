import React from "react";
import type { Tone } from "../../lib/match";

export type ChipTone = "matched" | "partial" | "missing" | "neutral" | "brand" | Tone;

const TONES: Record<ChipTone, string> = {
  matched: "bg-emerald-950 text-emerald-300 ring-emerald-800/60",
  partial: "bg-amber-950 text-amber-300 ring-amber-800/60",
  missing: "bg-rose-950 text-rose-300 ring-rose-800/60",
  neutral: "bg-slate-800 text-slate-200 ring-slate-700",
  brand: "bg-indigo-950 text-indigo-200 ring-indigo-800/60",
  emerald: "bg-emerald-950 text-emerald-300 ring-emerald-800/60",
  teal: "bg-teal-950 text-teal-300 ring-teal-800/60",
  amber: "bg-amber-950 text-amber-300 ring-amber-800/60",
  rose: "bg-rose-950 text-rose-300 ring-rose-800/60",
};

export default function Chip({
  tone,
  className = "",
  children,
}: {
  tone: ChipTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
