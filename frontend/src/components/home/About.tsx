import React from "react";
import { GITHUB_URL } from "../Navbar";
import { projectStats } from "../../data/projectStats";

const LINKS = [
  { label: "Source on GitHub ↗", href: GITHUB_URL },
  { label: "API docs ↗", href: "https://sreevardhan1729-aijobfit-backend.hf.space/docs" },
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/sreevardhanreddy/" },
  { label: "Email", href: "mailto:itssreevardhan@gmail.com" },
];

// A colophon: who made it, with what, and where to read more.
export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6">
      <div id="about" className="grid scroll-mt-24 gap-6 border-t border-ink pt-6 lg:grid-cols-[1fr_auto] lg:items-baseline">
        <div>
          <h2 className="font-serif text-2xl font-medium text-ink">About this project</h2>
          <p className="mt-2 text-ink">Built by Sree Vardhan Reddy, software engineer in India.</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-2">
            React, TypeScript and Tailwind on Vercel · FastAPI, spaCy and MongoDB on Hugging Face ·{" "}
            {projectStats.backendTests} backend and {projectStats.frontendTests} frontend tests
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
