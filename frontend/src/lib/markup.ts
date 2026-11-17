import type { SkillMatch } from "../types";

// A run of job text, tied to the skill it names when it's a mark.
export type Segment = { text: string; skill?: SkillMatch };

// Skills and aliases the backend never scans because they're ordinary words too (app/data/skills.json: the
// scan:false skills and the unscanned aliases). They're marked only when written exactly as the backend sent
// them and capitalised ("REST", "Go"), so "the rest of the team" stays plain.
const AMBIGUOUS = new Set([
  "c", "chef", "helm", "julia", "puppet", "r", "swift",
  "accessibility", "backend", "excel", "express", "frontend", "full stack", "go", "illustrator", "lambda",
  "networking", "node", "oracle", "rails", "rest", "shell", "spark", "spring", "ts", "ui", "unity", "unreal",
  "user experience", "ux",
]);

type Hit = { start: number; end: number; skill: SkillMatch };

const escapeRegExp = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isWordChar = (ch: string | undefined) => ch !== undefined && /[A-Za-z0-9]/.test(ch);

// Every match of the terms that respects the backend scanner's word boundaries (app/matching/skills.py): no
// letter or digit before, no letter, digit, + or # after. The "before" check is done by hand because Safari
// before 16.4 can't parse regex lookbehind.
function findHits(text: string, terms: Map<string, SkillMatch>, caseSensitive: boolean): Hit[] {
  if (terms.size === 0) return [];
  // Longest first, so "Deep Learning" wins over "Learning" at the same position.
  const alternatives = [...terms.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const pattern = new RegExp(`(?:${alternatives.join("|")})(?![A-Za-z0-9+#])`, caseSensitive ? "g" : "gi");
  const hits: Hit[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const skill = terms.get(caseSensitive ? match[0] : match[0].toLowerCase());
    if (isWordChar(text[start - 1]) || !skill) {
      pattern.lastIndex = start + 1;
      continue;
    }
    hits.push({ start, end: start + match[0].length, skill });
  }
  return hits;
}

// Splits job text into plain runs and skill marks. The backend sends only the first wording it found for a
// skill, so each skill is searched by its job wording, its name and the resume's wording.
export function markSkills(text: string, skills: SkillMatch[]): Segment[] {
  if (!text) return [];
  const loose = new Map<string, SkillMatch>(); // lowercased term → skill, matched in any case
  const exact = new Map<string, SkillMatch>(); // ambiguous terms, matched only as written
  for (const skill of skills) {
    for (const raw of [skill.job_term, skill.name, skill.resume_term]) {
      const term = raw?.trim();
      if (!term || term.length < 2) continue; // single letters (C, R) are never marked
      if (!AMBIGUOUS.has(term.toLowerCase())) {
        if (!loose.has(term.toLowerCase())) loose.set(term.toLowerCase(), skill);
      } else if (/[A-Z]/.test(term) && !exact.has(term)) {
        exact.set(term, skill);
      }
    }
  }

  const hits = [...findHits(text, loose, false), ...findHits(text, exact, true)].sort(
    (a, b) => a.start - b.start || b.end - a.end
  );
  const segments: Segment[] = [];
  let last = 0;
  for (const hit of hits) {
    if (hit.start < last) continue; // overlaps an earlier, longer mark
    if (hit.start > last) segments.push({ text: text.slice(last, hit.start) });
    segments.push({ text: text.slice(hit.start, hit.end), skill: hit.skill });
    last = hit.end;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}

// Scraped descriptions use **bold** markers; the marked-up view shows plain text.
export function plainJobText(raw: string): string {
  return raw.replace(/\*\*/g, "");
}
