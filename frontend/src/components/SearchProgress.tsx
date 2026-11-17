import React, { useEffect, useState } from "react";
import { searchStage } from "../lib/match";
import Spinner from "./ui/Spinner";

export default function SearchProgress() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto mt-6 flex max-w-4xl items-center gap-4 border border-rule bg-sheet p-5">
      <Spinner className="h-6 w-6 text-ink" />
      <div className="flex-1">
        {/* Only the stage is announced; the per-second counter would be read out every second. */}
        <p aria-live="polite" className="font-medium text-ink">
          {searchStage(elapsed)}
        </p>
        <p className="text-xs text-ink-2">Usually 20–60 seconds</p>
      </div>
      <span aria-hidden="true" className="text-sm tabular-nums text-ink-2">
        {elapsed}s
      </span>
    </div>
  );
}
