import React from "react";

export default function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div id={id} className="mb-8 scroll-mt-24">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-slate-400">{subtitle}</p>}
    </div>
  );
}
