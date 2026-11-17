import React from "react";
import type { SkillMatch } from "../types";
import { markSkills } from "../lib/markup";
import Mark from "./ui/Mark";
import type { MarkKind } from "./ui/Mark";

const markFor = (skill: SkillMatch, have: ReadonlySet<string>): MarkKind =>
  have.has(skill.key) || skill.status === "matched" ? "have" : skill.status === "partial" ? "close" : "miss";

// Job text with its skills marked in place. Blank lines start paragraphs; single line breaks are kept.
export default function MarkedText({
  text,
  skills,
  have = new Set(),
}: {
  text: string;
  skills: SkillMatch[];
  have?: ReadonlySet<string>;
}) {
  const paragraphs = text.split(/\n\s*\n/).filter((para) => para.trim());
  return (
    <>
      {paragraphs.map((para, p) => (
        <p key={p} className="mb-3 last:mb-0">
          {para.split("\n").map((line, l) => (
            <React.Fragment key={l}>
              {l > 0 && <br />}
              {markSkills(line, skills).map((seg, s) =>
                seg.skill ? (
                  <Mark key={s} kind={markFor(seg.skill, have)}>
                    {seg.text}
                  </Mark>
                ) : (
                  seg.text
                )
              )}
            </React.Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

export function MarkLegend({ className = "" }: { className?: string }) {
  return (
    <p className={`flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2 ${className}`}>
      <Mark kind="have" className="text-ink">on your resume</Mark>
      <Mark kind="close" className="text-ink">close match</Mark>
      <Mark kind="miss" className="text-ink">missing</Mark>
    </p>
  );
}
