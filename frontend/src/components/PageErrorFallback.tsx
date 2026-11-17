import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageErrorFallback() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
      <div className="max-w-md border border-rule bg-sheet p-10 text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
          <svg className="h-10 w-10 text-miss-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="mb-3 font-serif text-3xl font-medium text-ink">Page error</h1>
        <p className="mb-6 text-ink-2">
          This page encountered an error. Please try again or go back to the home page.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-[3px] border border-ink px-6 py-2 text-sm font-medium text-ink hover:bg-paper"
          >
            Reload Page
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-[3px] bg-ink px-6 py-2 text-sm font-semibold text-paper hover:bg-ink-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
