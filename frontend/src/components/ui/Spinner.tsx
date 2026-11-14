import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span role="status" className="inline-flex">
      <Loader2 aria-hidden className={`animate-spin ${className}`} />
      <span className="sr-only">Loading</span>
    </span>
  );
}
