import React from "react";
import { BookOpen, Mail } from "lucide-react";
import { GITHUB_URL } from "../Navbar";
import { projectStats } from "../../data/projectStats";
import { ReactComponent as GitHubIcon } from "../../svgs/github.svg";
import { ReactComponent as LinkedinIcon } from "../../svgs/linkedin.svg";

const ICON = "h-4 w-4 fill-current";

const LINKS = [
  { label: "Source on GitHub ↗", href: GITHUB_URL, icon: <GitHubIcon aria-hidden className={ICON} /> },
  {
    label: "API docs ↗",
    href: "https://sreevardhan1729-aijobfit-backend.hf.space/docs",
    icon: <BookOpen size={16} aria-hidden />,
  },
  {
    label: "LinkedIn ↗",
    href: "https://www.linkedin.com/in/sreevardhanreddy/",
    icon: <LinkedinIcon aria-hidden className={ICON} />,
  },
  { label: "Email", href: "mailto:itssreevardhan@gmail.com", icon: <Mail size={16} aria-hidden /> },
];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div
        id="about"
        className="flex scroll-mt-24 flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">About this project</p>
          <p className="mt-2 text-lg font-semibold text-slate-100">Built by Sree Vardhan Reddy, software engineer in India</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
            React, TypeScript and Tailwind on Vercel · FastAPI, spaCy and MongoDB on Hugging Face ·{" "}
            {projectStats.backendTests} backend and {projectStats.frontendTests} frontend tests
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {LINKS.map(({ label, href, icon }) => (
            <li key={label}>
              <a
                href={href}
                className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {icon}
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
