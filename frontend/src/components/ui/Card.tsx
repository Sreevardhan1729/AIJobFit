import React from "react";

// A sheet of paper: white, one hairline, no radius or shadow.
export default function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`border border-rule bg-sheet p-6 ${className}`}>{children}</div>;
}
