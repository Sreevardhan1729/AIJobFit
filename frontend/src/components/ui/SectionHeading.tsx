import React from "react";

export default function SectionHeading({ id, title, subtitle }: { id?: string; title: string; subtitle?: string }) {
  return (
    <div id={id} className="mb-8 scroll-mt-24">
      <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-ink-2">{subtitle}</p>}
    </div>
  );
}
