import React from "react";

export default function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-6 ${className}`}>{children}</div>;
}
