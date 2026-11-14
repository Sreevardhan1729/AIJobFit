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
    <div className="mx-auto mt-6 flex max-w-3xl items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <Spinner className="h-6 w-6 text-indigo-300" />
      <div className="flex-1">
        {/* Only the stage is announced; the per-second counter would be read out every second. */}
        <p aria-live="polite" className="font-medium text-slate-100">
          {searchStage(elapsed)}
        </p>
        <p className="text-xs text-slate-400">Usually 20–60 seconds</p>
      </div>
      <span aria-hidden="true" className="font-mono text-sm text-slate-400">
        {elapsed}s
      </span>
    </div>
  );
}
