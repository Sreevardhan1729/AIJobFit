import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SITE_OPTIONS, CITY_OPTIONS_BY_COUNTRY, COUNTRIES, JOB_TYPES } from "../constants";
import ResumeSelector from "./ResumeSelector";

interface JobSearchFormProps {
  onSubmit: (params: {
    selectedSites: string[];
    searchTerm: string;
    country: string;
    city: string;
    jobType: string;
    resumeFile: File | null;
    resumeId?: string;
  }) => void;
  isLoading: boolean;
  error: string;
  onBack: () => void;
}

export default function JobSearchForm({ onSubmit, isLoading, error, onBack }: JobSearchFormProps) {
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [jobType, setJobType] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ selectedSites, searchTerm, country, city, jobType, resumeFile, resumeId });
  };

  const handleSiteToggle = (value: string) => {
    setSelectedSites((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setCity("");
  };

  const availableCities = country ? CITY_OPTIONS_BY_COUNTRY[country] || [] : [];

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className="space-y-10 p-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Site multi-select */}
          <div ref={dropdownRef} className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700">Select Sites:</label>
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 transition-colors hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              onClick={() => setIsDropdownOpen((p) => !p)}
            >
              <span>
                {selectedSites.length > 0
                  ? SITE_OPTIONS.filter((opt) => selectedSites.includes(opt.value))
                      .map((opt) => opt.label)
                      .join(", ")
                  : "Choose sites"}
              </span>
              <svg
                className={`h-5 w-5 transform text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 max-h-48 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                {SITE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center px-4 py-3 text-sm hover:bg-gray-100">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={selectedSites.includes(opt.value)}
                      onChange={() => handleSiteToggle(opt.value)}
                      className="form-checkbox h-5 w-5 rounded text-indigo-600"
                    />
                    <span className="ml-3 text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Search term */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Job Title / Keyword:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Country:</label>
            <select
              value={country}
              onChange={handleCountryChange}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="" disabled>Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">City:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!country}
              className={`w-full appearance-none rounded-lg border ${country ? "border-gray-300" : "border-gray-200 bg-gray-100"} bg-white px-3 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
            >
              <option value="" disabled>{country ? "Select City" : "Choose country first"}</option>
              {availableCities.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Job Type:</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="" disabled>Select Job Type</option>
              {JOB_TYPES.map((jt) => (
                <option key={jt.value} value={jt.value}>{jt.label}</option>
              ))}
            </select>
          </div>

          {/* Resume */}
          <div className="sm:col-span-2">
            <ResumeSelector
              onResumeSelect={(id) => { setResumeId(id); setResumeFile(null); }}
              onFileSelect={(file) => { setResumeFile(file); setResumeId(undefined); }}
              selectedResumeId={resumeId}
              selectedFile={resumeFile}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center rounded-lg bg-indigo-500 px-12 py-3 text-sm text-white shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Search"
            )}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center rounded-lg bg-gray-300 px-12 py-3 text-sm text-gray-800 shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}
