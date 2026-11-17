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

const LINK = "text-sm text-ink-2 transition-colors hover:text-ink";
const ACTIVE_LINK = "text-sm font-semibold text-ink underline decoration-2 underline-offset-[6px]";
const MOBILE_LINK = "block py-2 text-sm text-ink";
const AUTH_BUTTON = "rounded-[3px] border border-ink px-3 py-1.5 text-sm font-medium text-ink hover:bg-sheet";

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
      <span className="max-w-[12rem] truncate text-sm text-ink-2">{user?.email}</span>
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
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" onClick={closeMenu} className="font-serif text-xl font-semibold text-ink">
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
            <span aria-hidden className="h-4 w-px bg-rule" />
            <a href="/#how-it-works" className={LINK}>
              How it works
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub
            </a>
            {authControl}
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="p-2 text-ink md:hidden"
          >
            {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </nav>

        {mobileOpen && (
          <div id="mobile-menu" className="border-t border-rule bg-paper px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  onClick={closeMenu}
                  aria-current={isActive(tool.to) ? "page" : undefined}
                  className={`${MOBILE_LINK} ${isActive(tool.to) ? "font-semibold underline underline-offset-4" : ""}`}
                >
                  {tool.label}
                </Link>
              ))}
              <a href="/#how-it-works" onClick={closeMenu} className={MOBILE_LINK}>
                How it works
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={MOBILE_LINK}>
                GitHub
              </a>
              <div className="pt-3">{authControl}</div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
