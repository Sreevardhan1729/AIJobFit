import React from "react";
import type { Tone } from "../../lib/match";

// How a skill reads in the marked-up job post: highlighter for what you have and what's close, a
// spell-checker underline for what's missing.
export type MarkKind = "have" | "close" | "miss" | "plain";

const KINDS: Record<MarkKind, string> = {
  have: "rounded-sm bg-have px-0.5 [box-decoration-break:clone]",
  close: "rounded-sm bg-close px-0.5 [box-decoration-break:clone]",
  miss: "underline decoration-miss decoration-wavy decoration-[1.5px] underline-offset-[3px]",
  plain: "text-ink-2",
};

export default function Mark({
  kind,
  className = "",
  children,
}: {
  kind: MarkKind;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span data-mark={kind} className={`${KINDS[kind]} ${className}`}>
      {children}
    </span>
  );
}

const BAND_MARK: Record<Tone, Exclude<MarkKind, "plain">> = {
  emerald: "have",
  teal: "have",
  amber: "close",
  rose: "miss",
};

export const bandMark = (tone: Tone) => BAND_MARK[tone];
