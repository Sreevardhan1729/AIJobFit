import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto flex flex-col items-center px-5 py-8 sm:flex-row">
        <a className="flex items-center font-medium text-white md:justify-start" href="#home">
          <span className="ml-3 text-xl">AIJobFit</span>
        </a>
        <p className="mt-4 text-sm text-gray-400 sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-800 sm:py-2 sm:pl-4">
          &copy; {new Date().getFullYear()} AIJobFit &mdash;
          <a
            href="https://github.com/Sreevardhan1729"
            className="ml-1 text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            @aijobfit
          </a>
        </p>
      </div>
    </footer>
  );
}
