import React, { useId, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import type { FitStatus, MatchResult, SkillMatch, SkillStatus } from "../types";
import { biggestGaps, matchLabel, matchSummary, scoreBreakdown } from "../lib/match";
import MarkedText, { MarkLegend } from "./MarkedText";
import Mark, { bandMark } from "./ui/Mark";
import type { MarkKind } from "./ui/Mark";

// Worst first: what to work on, then what's close, then what you already have.
const GROUPS: { status: SkillStatus; title: string; mark: MarkKind }[] = [
  { status: "missing", title: "Missing skills", mark: "miss" },
  { status: "partial", title: "Close matches", mark: "close" },
  { status: "matched", title: "Matched skills", mark: "have" },
];

const LIST_LIMIT = 8;

const FIT_MARK: Record<FitStatus, MarkKind | null> = {
  meets: "have",
  below: "close",
  unknown: null,
};

const TEXT_BUTTON = "text-sm font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink";

// 1.25 → "1.25", 2.5 → "2.5", 4 → "4"
const formatPoints = (n: number) => String(Math.round(n * 100) / 100);

function SkillChip({ skill, mark, marked, onToggle }: {
  skill: SkillMatch;
  mark: MarkKind;
  marked: boolean;
  onToggle: (key: string) => void;
}) {
  const content = (
    <>
      <Mark kind={marked ? "have" : mark}>{skill.name}</Mark>
      {skill.via && <span className="text-ink-2">via {skill.via}</span>}
      {skill.importance === "preferred" && <span className="text-xs text-ink-2">preferred</span>}
    </>
  );

  if (skill.status === "matched") {
    return <li className="inline-flex items-center gap-1.5 py-1 text-sm text-ink">{content}</li>;
  }
  return (
    <li>
      <button
        type="button"
        aria-pressed={marked}
        onClick={() => onToggle(skill.key)}
        className="inline-flex items-center gap-1.5 rounded-[3px] border border-rule bg-sheet px-2 py-1 text-sm text-ink hover:border-ink"
      >
        {marked ? <Check size={13} aria-hidden /> : <Plus size={13} aria-hidden />}
        {content}
      </button>
    </li>
  );
}

// A collapsed row in the details sheet; the summary above already gives the answer.
function Section({ title, count, defaultOpen = false, children }: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-t border-rule first:border-t-0">
      <button
        id={`${id}-button`}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-semibold text-ink"
      >
        <span>
          {title}
          {count !== undefined && <span className="font-normal text-ink-2"> ({count})</span>}
        </span>
        <ChevronDown size={16} aria-hidden className={`shrink-0 text-ink-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function SkillList({ skills, mark, have, onToggle }: {
  skills: SkillMatch[];
  mark: MarkKind;
  have: ReadonlySet<string>;
  onToggle: (key: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? skills : skills.slice(0, LIST_LIMIT);
  return (
    <>
      <ul className="flex flex-wrap gap-x-3 gap-y-2">
        {shown.map((skill) => (
          <SkillChip key={skill.key} skill={skill} mark={mark} marked={have.has(skill.key)} onToggle={onToggle} />
        ))}
      </ul>
      {skills.length > LIST_LIMIT && (
        <button type="button" onClick={() => setShowAll((all) => !all)} className={`mt-3 ${TEXT_BUTTON}`}>
          {showAll ? "Show fewer" : `Show all ${skills.length}`}
        </button>
      )}
    </>
  );
}

function FitRow({ label, asks, shows, status }: {
  label: string;
  asks: string | null;
  shows: string | null;
  status: FitStatus;
}) {
  if (asks === null && shows === null) return null;
  const mark = FIT_MARK[status];
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-rule-soft py-2.5 first:border-t-0">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="flex flex-wrap items-baseline gap-2 text-sm text-ink-2">
        <span>{asks !== null ? `Job asks: ${asks}` : "Job doesn't say"}</span>
        <span aria-hidden>·</span>
        <span>{shows !== null ? `Your resume: ${shows}` : "Couldn't tell from your resume"}</span>
        {mark && <Mark kind={mark} className="text-ink">{status}</Mark>}
      </span>
    </div>
  );
}

export default function MatchReport({ result, jobText, jobTextOpen = false }: {
  result: MatchResult;
  jobText?: string;
  jobTextOpen?: boolean;
}) {
  const [have, setHave] = useState<Set<string>>(new Set());
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (result.score === null) {
    return <div className="border border-rule bg-sheet p-6 text-sm text-ink-2">No skills found in this job description.</div>;
  }

  const breakdown = scoreBreakdown(result.skills, have);
  const current = breakdown.score ?? 0;
  const label = matchLabel(current);
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
  const gaps = biggestGaps(result.skills, have);

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-rule bg-sheet p-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-serif text-6xl font-medium leading-none text-ink">{current}%</span>
          {label && (
            <Mark kind={bandMark(label.tone)} className="text-sm font-semibold">
              {label.label}
            </Mark>
          )}
          {have.size > 0 && (
            <span className="text-xs text-ink-2">was {result.score}% · with the skills you marked</span>
          )}
          <button
            type="button"
            aria-expanded={showBreakdown}
            onClick={() => setShowBreakdown((open) => !open)}
            className={`inline-flex items-center gap-1 sm:ml-auto ${TEXT_BUTTON}`}
          >
            How this is scored
            <ChevronDown size={14} aria-hidden className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
          </button>
        </div>
        {showBreakdown && (
          <div className="mt-4 space-y-1.5 border-l-2 border-ink pl-4 text-sm text-ink">
            <p>Required skills are worth 1 point, preferred ½. Matched earns full points, partial earns half.</p>
            <p className="font-semibold">
              You have {formatPoints(breakdown.earned)} of {formatPoints(breakdown.total)} points → {current}%.
            </p>
            <p className="text-ink-2">
              Required: {required.matched} matched, {required.partial} partial of {required.total} · Preferred:{" "}
              {preferred.matched} matched, {preferred.partial} partial of {preferred.total}
            </p>
          </div>
        )}

        <p className="mt-5 text-base text-ink">{matchSummary(breakdown)}</p>
        {gaps.names.length > 0 && (
          <p className="mt-2 text-sm text-ink-2">
            <span className="font-semibold text-ink">Biggest gaps</span>:{" "}
            {gaps.names.map((name, i) => (
              <React.Fragment key={name}>
                {i > 0 && ", "}
                <Mark kind="miss" className="text-ink">{name}</Mark>
              </React.Fragment>
            ))}
            {gaps.more > 0 && <span> and {gaps.more} more</span>}
          </p>
        )}

        {showFit && (
          <div className="mt-4 border-t border-rule pt-1">
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
        <p className="mt-4 text-xs text-ink-2">Estimate from skill overlap, not an employer's ATS score.</p>
      </div>

      <div className="border border-rule bg-sheet px-5">
        {jobText?.trim() && (
          <Section title="The job post, marked up" defaultOpen={jobTextOpen}>
            <div className="max-h-96 overflow-y-auto pr-2 text-sm leading-7 text-ink">
              <MarkedText text={jobText} skills={result.skills} have={have} />
            </div>
            <MarkLegend className="mt-3 border-t border-rule-soft pt-3" />
          </Section>
        )}
        {GROUPS.map(({ status, title, mark }) => {
          const skills = result.skills.filter((s) => s.status === status);
          if (skills.length === 0) return null;
          return (
            <Section key={status} title={title} count={skills.length}>
              {status !== "matched" && (
                <p className="mb-3 text-xs text-ink-2">
                  Click a skill only if you really have it, to see how your score would change.
                </p>
              )}
              <SkillList skills={skills} mark={mark} have={have} onToggle={toggle} />
            </Section>
          );
        })}
        {result.tips.length > 0 && (
          <Section title="Tips" count={result.tips.length}>
            <ul className="list-disc space-y-2 pl-5 text-sm text-ink">
              {result.tips.map((tip) => (
                <li key={tip.skill}>{tip.message}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}
