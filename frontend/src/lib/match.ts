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
