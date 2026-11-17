import type { SkillMatch } from "../types";

// A run of job text, tied to the skill it names when it's a mark.
export type Segment = { text: string; skill?: SkillMatch };

const escapeRegExp = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Splits job text into plain runs and skill marks. The backend sends only the first wording it found for a
// skill, so each skill is searched by its job wording, its name and the resume's wording. Word boundaries
// copy the backend scanner (app/matching/skills.py): no letter or digit before, no letter, digit, + or # after.
export function markSkills(text: string, skills: SkillMatch[]): Segment[] {
  if (!text) return [];
  const byTerm = new Map<string, SkillMatch>();
  for (const skill of skills) {
    for (const term of [skill.job_term, skill.name, skill.resume_term]) {
      const key = term?.trim().toLowerCase();
      if (key && !byTerm.has(key)) byTerm.set(key, skill);
    }
  }
  if (byTerm.size === 0) return [{ text }];

  // Longest first, so "Deep Learning" wins over "Learning" at the same position.
  const terms = [...byTerm.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const pattern = new RegExp(`(?<![A-Za-z0-9])(?:${terms.join("|")})(?![A-Za-z0-9+#])`, "gi");

  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ text: text.slice(last, start) });
    segments.push({ text: match[0], skill: byTerm.get(match[0].toLowerCase()) });
    last = start + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}

// Scraped descriptions use **bold** markers; the marked-up view shows plain text.
export function plainJobText(raw: string): string {
  return raw.replace(/\*\*/g, "");
}
