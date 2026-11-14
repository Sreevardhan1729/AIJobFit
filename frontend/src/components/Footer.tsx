import React from "react";

const LINKS = [
  { label: "GitHub", href: "https://github.com/Sreevardhan1729" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sreevardhanreddy/" },
  { label: "Email", href: "mailto:itssreevardhan@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} AIJobFit · Built by Sree Vardhan Reddy
        </p>
        <div className="flex gap-5">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-slate-300"
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
