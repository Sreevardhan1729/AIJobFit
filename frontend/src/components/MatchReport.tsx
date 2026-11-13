import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lightbulb, Plus } from "lucide-react";
import type { FitStatus, MatchResult, SkillMatch, SkillStatus } from "../types";
import { computeScore } from "../lib/match";

const GROUPS: { status: SkillStatus; title: string; chip: string }[] = [
  { status: "matched", title: "Matched", chip: "bg-emerald-100 text-emerald-700" },
  { status: "partial", title: "Partial", chip: "bg-amber-100 text-amber-800 ring-1 ring-amber-300 hover:ring-2" },
  { status: "missing", title: "Missing", chip: "bg-rose-100 text-rose-700 ring-1 ring-rose-300 hover:ring-2" },
];

const FIT_BADGE: Record<FitStatus, string | null> = {
  meets: "bg-emerald-100 text-emerald-700",
  below: "bg-amber-100 text-amber-800",
  unknown: null,
};

function SkillChip({ skill, chip, marked, onToggle }: {
  skill: SkillMatch;
  chip: string;
  marked: boolean;
  onToggle: (key: string) => void;
}) {
  const content = (
    <>
      {skill.status !== "matched" && (marked ? <Check size={12} /> : <Plus size={12} />)}
      {skill.name}
      {skill.via && <span className="opacity-75">via {skill.via}</span>}
      {skill.importance === "preferred" && (
        <span className="rounded-full bg-white/70 px-1.5 text-[10px] uppercase tracking-wide">preferred</span>
      )}
    </>
  );
  const base = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow";

  if (skill.status === "matched") {
    return <li className={`${base} ${chip}`}>{content}</li>;
  }
  return (
    <motion.li whileTap={{ scale: 0.9 }}>
      <button
        type="button"
        onClick={() => onToggle(skill.key)}
        className={`${base} transition-transform duration-150 hover:-translate-y-0.5 ${
          marked ? "bg-emerald-100 text-emerald-700" : chip
        }`}
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
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 py-3 first:border-t-0">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <span className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Job asks {asks ?? "couldn't tell"} · your resume shows {shows ?? "couldn't tell"}
        </span>
        {badge && <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>{status}</span>}
      </span>
    </div>
  );
}

export default function MatchReport({ result }: { result: MatchResult }) {
  const [have, setHave] = useState<Set<string>>(new Set());

  if (result.score === null) {
    return (
      <div className="rounded-3xl bg-white/70 p-6 text-sm text-gray-600 shadow-lg backdrop-blur">
        No skills found in this job description.
      </div>
    );
  }

  const current = computeScore(result.skills, have);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 shadow-lg">
        <motion.span
          key={current}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
          className="text-4xl font-extrabold text-emerald-600"
        >
          {current}%
        </motion.span>
        <div>
          <p className="text-sm font-medium text-emerald-700">Match</p>
          {have.size > 0 && (
            <p className="text-xs text-emerald-700/80">was {result.score}% · with the skills you marked</p>
          )}
        </div>
        <p className="ml-auto text-xs text-emerald-800/70">
          Click a partial or missing skill to see your score if you had it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {GROUPS.map(({ status, title, chip }) => {
          const skills = result.skills.filter((s) => s.status === status);
          if (skills.length === 0) return null;
          return (
            <div key={status} className="rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur">
              <h3 className="mb-4 text-lg font-bold text-gray-800">
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
        <div className="rounded-3xl bg-white/70 px-6 py-3 shadow-lg backdrop-blur">
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
        <div className="rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <Lightbulb size={18} className="text-amber-500" />
            Tips
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {result.tips.map((tip) => (
              <li key={tip.skill}>{tip.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
