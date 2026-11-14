import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Lightbulb, Plus } from "lucide-react";
import type { FitStatus, MatchResult, SkillMatch, SkillStatus } from "../types";
import { matchLabel, scoreBreakdown } from "../lib/match";
import type { Tone } from "../lib/match";
import Chip from "./ui/Chip";

const GROUPS: { status: SkillStatus; title: string; chip: string }[] = [
  { status: "matched", title: "Matched", chip: "bg-emerald-950 text-emerald-300 ring-emerald-800/60" },
  { status: "partial", title: "Partial", chip: "bg-amber-950 text-amber-300 ring-amber-800/60" },
  { status: "missing", title: "Missing", chip: "bg-rose-950 text-rose-300 ring-rose-800/60" },
];

const MARKED_CHIP = "bg-emerald-950 text-emerald-300 ring-emerald-500/70";

const SCORE_COLOR: Record<Tone, string> = {
  emerald: "text-emerald-300",
  teal: "text-teal-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};

const FIT_BADGE: Record<FitStatus, "matched" | "partial" | null> = {
  meets: "matched",
  below: "partial",
  unknown: null,
};

// 1.25 → "1.25", 2.5 → "2.5", 4 → "4"
const formatPoints = (n: number) => String(Math.round(n * 100) / 100);

function SkillChip({ skill, chip, marked, onToggle }: {
  skill: SkillMatch;
  chip: string;
  marked: boolean;
  onToggle: (key: string) => void;
}) {
  const content = (
    <>
      {skill.status !== "matched" && (marked ? <Check size={12} aria-hidden /> : <Plus size={12} aria-hidden />)}
      {skill.name}
      {skill.via && <span className="opacity-75">via {skill.via}</span>}
      {skill.importance === "preferred" && (
        <span className="rounded-full bg-slate-950/60 px-1.5 text-[10px] uppercase tracking-wide">preferred</span>
      )}
    </>
  );
  const base = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset";

  if (skill.status === "matched") {
    return <li className={`${base} ${chip}`}>{content}</li>;
  }
  return (
    <motion.li whileTap={{ scale: 0.92 }}>
      <button
        type="button"
        onClick={() => onToggle(skill.key)}
        className={`${base} transition hover:-translate-y-0.5 hover:ring-2 ${marked ? MARKED_CHIP : chip}`}
      >
        {content}
      </button>
    </motion.li>
  );
}

function FitRow({ label, asks, shows, status }: {
  label: string;
  asks: string | null;
  shows: string | null;
  status: FitStatus;
}) {
  if (asks === null && shows === null) return null;
  const badge = FIT_BADGE[status];
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 py-3 first:border-t-0">
      <span className="text-sm font-semibold text-slate-100">{label}</span>
      <span className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <span>{asks !== null ? `Job asks: ${asks}` : "Job doesn't say"}</span>
        <span aria-hidden>·</span>
        <span>{shows !== null ? `Your resume: ${shows}` : "Couldn't tell from your resume"}</span>
        {badge && <Chip tone={badge}>{status}</Chip>}
      </span>
    </div>
  );
}

export default function MatchReport({ result }: { result: MatchResult }) {
  const [have, setHave] = useState<Set<string>>(new Set());
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (result.score === null) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
        No skills found in this job description.
      </div>
    );
  }

  const breakdown = scoreBreakdown(result.skills, have);
  const current = breakdown.score ?? 0;
  const label = matchLabel(current);
  const canMark = result.skills.some((s) => s.status !== "matched");
  const toggle = (key: string) =>
    setHave((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const { experience, education } = result;
  const showFit =
    experience.required_years !== null || experience.resume_years !== null ||
    education.required_level !== null || education.resume_level !== null;
  const { required, preferred } = breakdown;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <motion.span
            key={current}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className={`text-5xl font-extrabold ${label ? SCORE_COLOR[label.tone] : "text-slate-100"}`}
          >
            {current}%
          </motion.span>
          {label && <Chip tone={label.tone}>{label.label}</Chip>}
          {have.size > 0 && (
            <span className="text-xs text-slate-400">was {result.score}% · with the skills you marked</span>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-400">Estimate from skill overlap, not an employer's ATS score.</p>
        {canMark && (
          <p className="mt-1 text-xs text-slate-400">
            Click a missing skill only if you really have it, to see how your score would change.
          </p>
        )}
        <button
          type="button"
          aria-expanded={showBreakdown}
          onClick={() => setShowBreakdown((open) => !open)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          How this is scored
          <ChevronDown size={14} aria-hidden className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
        </button>
        {showBreakdown && (
          <div className="mt-3 space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            <p>Required skills are worth 1 point, preferred ½. Matched earns full points, partial earns half.</p>
            <p className="font-medium text-slate-100">
              You have {formatPoints(breakdown.earned)} of {formatPoints(breakdown.total)} points → {current}%.
            </p>
            <p className="text-slate-400">
              Required: {required.matched} matched, {required.partial} partial of {required.total} · Preferred:{" "}
              {preferred.matched} matched, {preferred.partial} partial of {preferred.total}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        {GROUPS.map(({ status, title, chip }) => {
          const skills = result.skills.filter((s) => s.status === status);
          if (skills.length === 0) return null;
          return (
            <div key={status} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                {title} ({skills.length})
              </h3>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillChip key={skill.key} skill={skill} chip={chip} marked={have.has(skill.key)} onToggle={toggle} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {showFit && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-2">
          <FitRow
            label="Experience"
            asks={experience.required_years !== null ? `${experience.required_years}+ yrs` : null}
            shows={experience.resume_years !== null ? `~${experience.resume_years} yrs (estimate)` : null}
            status={experience.status}
          />
          <FitRow
            label="Education"
            asks={education.required_level}
            shows={education.resume_level}
            status={education.status}
          />
        </div>
      )}

      {result.tips.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            <Lightbulb size={16} aria-hidden className="text-amber-300" />
            Tips
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            {result.tips.map((tip) => (
              <li key={tip.skill}>{tip.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
