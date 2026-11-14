import React from "react";
import { Mail } from "lucide-react";
import { ReactComponent as GitHubIcon } from "../../svgs/github.svg";
import { ReactComponent as LinkedinIcon } from "../../svgs/linkedin.svg";
import { ReactComponent as LeetcodeIcon } from "../../svgs/leetcode.svg";

const PROFILES = [
  { label: "GitHub", href: "https://github.com/Sreevardhan1729", Icon: GitHubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sreevardhanreddy/", Icon: LinkedinIcon },
  { label: "LeetCode", href: "https://leetcode.com/u/Vardhan1729/", Icon: LeetcodeIcon },
];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">About</p>
          <p className="mt-2 text-lg font-semibold text-slate-100">Built by Sree Vardhan Reddy</p>
          <p className="text-sm text-slate-400">Software engineer, India</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {PROFILES.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
            >
              <Icon aria-hidden className="h-4 w-4 fill-current" />
              {label}
            </a>
          ))}
          <a
            href="mailto:itssreevardhan@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <Mail size={16} aria-hidden />
            itssreevardhan@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
