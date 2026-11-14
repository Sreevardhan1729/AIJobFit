import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageErrorFallback() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
      <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-950">
          <svg className="h-10 w-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-slate-100">Page Error</h1>
        <p className="mb-6 text-slate-400">
          This page encountered an error. Please try again or go back to the home page.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Reload Page
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
