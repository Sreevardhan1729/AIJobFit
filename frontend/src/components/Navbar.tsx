import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 w-full items-center bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6">
          <a href="#home" className="flex items-center font-medium text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-10 w-10 rounded-full bg-indigo-500 p-2 text-white"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="ml-3 text-xl">AIJobFit</span>
          </a>

          <nav className="flex space-x-6">
            <a href="#home" className="text-gray-600 no-underline transition duration-300 hover:text-black">
              Home
            </a>
            <a href="#features" className="text-gray-600 no-underline transition duration-300 hover:text-black">
              Features
            </a>
            <a href="#contact" className="text-gray-600 no-underline transition duration-300 hover:text-black">
              Contact Me
            </a>
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="inline-flex items-center rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center rounded bg-gray-100 px-3 py-1 text-base hover:bg-gray-200"
            >
              Login
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="ml-1 h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
