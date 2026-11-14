import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Chip from "../ui/Chip";
import Button from "../ui/Button";
import { GITHUB_URL } from "../Navbar";
import { projectStats } from "../../data/projectStats";

const STACK = ["React", "TypeScript", "Tailwind", "FastAPI", "spaCy", "MongoDB", "Hugging Face", "Vercel"];

const LINKS = [
  { label: "GitHub ↗", href: GITHUB_URL },
  { label: "Backend on Hugging Face ↗", href: "https://huggingface.co/spaces/Sreevardhan1729/AIJobFit-Backend" },
  { label: "API docs ↗", href: "https://sreevardhan1729-aijobfit-backend.hf.space/docs" },
];

export default function BuiltWith() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Built with" title="A small full-stack app, tested end to end" />
      <div className="flex flex-wrap gap-2">
        {STACK.map((item) => (
          <Chip key={item} tone="neutral" className="px-3 py-1 text-sm">
            {item}
          </Chip>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        {projectStats.backendTests} backend tests · {projectStats.frontendTests} frontend tests
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {LINKS.map((link) => (
          <Button key={link.href} href={link.href} variant="secondary">
            {link.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
