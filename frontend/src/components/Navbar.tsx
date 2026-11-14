import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export const GITHUB_URL = "https://github.com/Sreevardhan1729/AIJobFit";

// The product's tools stay visible at every width: the job search is the main thing people come for.
export const TOOLS = [
  { label: "Job search", to: "/get_jobs" },
  { label: "Compare", to: "/resume_job" },
  { label: "Analyze", to: "/job" },
];

const LINK = "text-sm text-slate-300 transition-colors hover:text-white";
const ACTIVE_LINK = "text-sm font-semibold text-white";
const MOBILE_LINK = "block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800";
const AUTH_BUTTON = "rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const closeMenu = () => setMobileOpen(false);

  const authControl = isAuthenticated ? (
    <div className="flex items-center gap-3">
      <span className="max-w-[12rem] truncate text-sm text-slate-400">{user?.email}</span>
      <button type="button" onClick={logout} className={AUTH_BUTTON}>
        Log out
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => {
        closeMenu();
        setShowAuthModal(true);
      }}
      className={AUTH_BUTTON}
    >
      Log in
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 font-semibold text-slate-100">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px] shadow-indigo-400" />
            AIJobFit
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                aria-current={isActive(tool.to) ? "page" : undefined}
                className={isActive(tool.to) ? ACTIVE_LINK : LINK}
              >
                {tool.label}
              </Link>
            ))}
            <span aria-hidden className="h-4 w-px bg-slate-700" />
            <a href="/#how-it-works" className={LINK}>
              How it works
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub ↗
            </a>
            {authControl}
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          >
            {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </nav>

        {mobileOpen && (
          <div id="mobile-menu" className="border-t border-slate-800 px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  onClick={closeMenu}
                  aria-current={isActive(tool.to) ? "page" : undefined}
                  className={`${MOBILE_LINK} ${isActive(tool.to) ? "bg-slate-800 font-semibold text-white" : ""}`}
                >
                  {tool.label}
                </Link>
              ))}
              <a href="/#how-it-works" onClick={closeMenu} className={MOBILE_LINK}>
                How it works
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={MOBILE_LINK}>
                GitHub ↗
              </a>
              <div className="px-3 pt-3">{authControl}</div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
