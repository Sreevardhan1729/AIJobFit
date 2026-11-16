import type { JobResult, SkillMatch } from "../types";

// Must stay identical to compute_score in the backend's app/matching/scoring.py.
export function computeScore(skills: SkillMatch[], have: ReadonlySet<string> = new Set()): number | null {
  let total = 0;
  let earned = 0;
  for (const skill of skills) {
    total += skill.weight;
    earned += skill.weight * (have.has(skill.key) ? 1 : skill.credit);
  }
  if (total === 0) return null;
  return Math.floor((100 * earned) / total + 0.5);
}

export interface SkillGap {
  key: string;
  name: string;
  missingIn: number;
  total: number;
}

const isGap = (skill: SkillMatch) => skill.status !== "matched";

export function aggregateGaps(jobs: JobResult[], limit = 8): SkillGap[] {
  const gaps = new Map<string, SkillGap>();
  for (const job of jobs) {
    for (const skill of job.match?.skills ?? []) {
      if (!isGap(skill)) continue;
      const gap = gaps.get(skill.key) ?? { key: skill.key, name: skill.name, missingIn: 0, total: jobs.length };
      gap.missingIn += 1;
      gaps.set(skill.key, gap);
    }
  }
  return Array.from(gaps.values())
    .sort((a, b) => b.missingIn - a.missingIn || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function jobMissesSkill(job: JobResult, key: string): boolean {
  return (job.match?.skills ?? []).some((skill) => skill.key === key && isGap(skill));
}

export type Tone = "emerald" | "teal" | "amber" | "rose";

export function matchLabel(score: number | null): { label: string; tone: Tone } | null {
  if (score === null) return null;
  if (score >= 70) return { label: "Strong match", tone: "emerald" };
  if (score >= 45) return { label: "Good match", tone: "teal" };
  if (score >= 25) return { label: "Fair match", tone: "amber" };
  return { label: "Low match", tone: "rose" };
}

export interface GroupCount {
  matched: number;
  partial: number;
  total: number;
}

export interface ScoreBreakdown {
  earned: number;
  total: number;
  score: number | null;
  required: GroupCount;
  preferred: GroupCount;
}

export function scoreBreakdown(skills: SkillMatch[], have: ReadonlySet<string> = new Set()): ScoreBreakdown {
  const required: GroupCount = { matched: 0, partial: 0, total: 0 };
  const preferred: GroupCount = { matched: 0, partial: 0, total: 0 };
  let total = 0;
  let earned = 0;
  for (const skill of skills) {
    const credit = have.has(skill.key) ? 1 : skill.credit;
    total += skill.weight;
    earned += skill.weight * credit;
    const group = skill.importance === "required" ? required : preferred;
    group.total += 1;
    if (credit === 1) group.matched += 1;
    else if (credit > 0) group.partial += 1;
  }
  return { earned, total, score: computeScore(skills, have), required, preferred };
}

export function skillPreview(skills: SkillMatch[], n = 3): { matches: string[]; missing: string[] } {
  const ordered = [
    ...skills.filter((skill) => skill.importance === "required"),
    ...skills.filter((skill) => skill.importance !== "required"),
  ];
  const names = (status: SkillMatch["status"]) =>
    ordered.filter((skill) => skill.status === status).slice(0, n).map((skill) => skill.name);
  return { matches: names("matched"), missing: names("missing") };
}

// "You have 9 of 26 skills the job asks for, plus 3 close matches."
export function matchSummary({ required, preferred }: ScoreBreakdown): string {
  const matched = required.matched + preferred.matched;
  const partial = required.partial + preferred.partial;
  const total = required.total + preferred.total;
  const close = partial === 0 ? "" : `, plus ${partial} close match${partial === 1 ? "" : "es"}`;
  return `You have ${matched} of ${total} skills the job asks for${close}.`;
}

// The first n missing skills (required first) and how many more there are, ignoring skills marked as owned.
export function biggestGaps(
  skills: SkillMatch[],
  have: ReadonlySet<string> = new Set(),
  n = 3
): { names: string[]; more: number } {
  const unmarked = skills.filter((skill) => !have.has(skill.key));
  const names = skillPreview(unmarked, n).missing;
  const more = unmarked.filter((skill) => skill.status === "missing").length - names.length;
  return { names, more };
}

// Hints driven by elapsed time: the backend does the whole search in one request.
const SEARCH_STAGES: [number, string][] = [
  [20, "Scoring against your resume…"],
  [8, "Reading job descriptions…"],
  [0, "Searching LinkedIn / Indeed…"],
];

export function searchStage(elapsedSeconds: number): string {
  const stage = SEARCH_STAGES.find(([startsAt]) => elapsedSeconds >= startsAt) ?? SEARCH_STAGES[SEARCH_STAGES.length - 1];
  return stage[1];
}

export interface SearchFields {
  hasResume: boolean;
  searchTerm: string;
  country: string;
  city: string;
  jobType: string;
  sites: string[];
}

// What the job search still needs, in the order the form asks for it.
export function missingFields(fields: SearchFields): string[] {
  const missing: string[] = [];
  if (!fields.hasResume) missing.push("your resume");
  if (!fields.searchTerm.trim()) missing.push("a job title");
  if (!fields.country) missing.push("a country");
  if (!fields.city) missing.push("a city");
  if (!fields.jobType) missing.push("a job type");
  if (fields.sites.length === 0) missing.push("at least one source");
  return missing;
}
