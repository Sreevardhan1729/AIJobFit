import React, { useState } from "react";
import { Check, Search } from "lucide-react";
import { SITE_OPTIONS, CITY_OPTIONS_BY_COUNTRY, COUNTRIES, JOB_TYPES } from "../constants";
import type { JobSearchInput } from "../hooks/useJobSearch";
import { missingFields } from "../lib/match";
import ResumeSelector from "./ResumeSelector";
import Button from "./ui/Button";
import { FIELD, LABEL } from "./ui/fieldStyles";
import Select from "./ui/Select";

interface JobSearchFormProps {
  onSubmit: (params: JobSearchInput) => void;
  isLoading: boolean;
  error: string;
}

// Defaults so a first search rarely fails validation: both sources, full-time, the author's market.
const DEFAULT_SITES = SITE_OPTIONS.map((opt) => opt.value as string);
const DEFAULT_JOB_TYPE = "fulltime";
const DEFAULT_COUNTRY = "India";

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-4">
      <span aria-hidden className="w-6 shrink-0 font-serif text-2xl font-medium leading-none text-ink">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="mb-3 text-base font-semibold text-ink">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function JobSearchForm({ onSubmit, isLoading, error }: JobSearchFormProps) {
  const [selectedSites, setSelectedSites] = useState<string[]>(DEFAULT_SITES);
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [city, setCity] = useState("");
  const [jobType, setJobType] = useState(DEFAULT_JOB_TYPE);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [missing, setMissing] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stillNeeded = missingFields({
      hasResume: Boolean(resumeFile || resumeId),
      searchTerm,
      country,
      city,
      jobType,
      sites: selectedSites,
    });
    setMissing(stillNeeded);
    if (stillNeeded.length > 0) return;
    onSubmit({ selectedSites, searchTerm, country, city, jobType, resumeFile, resumeId });
  };

  const toggleSite = (value: string) =>
    setSelectedSites((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const availableCities = country ? CITY_OPTIONS_BY_COUNTRY[country] || [] : [];

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-4xl space-y-8 border border-rule bg-sheet p-6 sm:p-8"
    >
      <Step number={1} title="Your resume">
        <ResumeSelector
          onResumeSelect={(id) => {
            setResumeId(id);
            setResumeFile(null);
          }}
          onFileSelect={(file) => {
            setResumeFile(file);
            setResumeId(undefined);
          }}
          selectedResumeId={resumeId}
          onFileClear={() => setResumeFile(null)}
          selectedFile={resumeFile}
        />
      </Step>

      <Step number={2} title="What and where">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="search-term" className={LABEL}>Job title or keyword</label>
            <input
              id="search-term"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Machine Learning Engineer"
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="job-type" className={LABEL}>Job type</label>
            <Select id="job-type" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              {JOB_TYPES.map((jt) => (
                <option key={jt.value} value={jt.value}>{jt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="country" className={LABEL}>Country</label>
            <Select
              id="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity("");
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="city" className={LABEL}>City</label>
            <Select id="city" value={city} onChange={(e) => setCity(e.target.value)} disabled={!country}>
              <option value="" disabled>Select city</option>
              {availableCities.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </Select>
          </div>
        </div>
      </Step>

      <Step number={3} title="Sources">
        <div className="flex flex-wrap gap-2">
          {SITE_OPTIONS.map((opt) => {
            const on = selectedSites.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSite(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-[3px] border px-4 py-1.5 text-sm font-medium transition-colors ${
                  on ? "border-ink bg-ink text-paper" : "border-rule bg-sheet text-ink-2 hover:border-ink hover:text-ink"
                }`}
              >
                {on && <Check size={14} aria-hidden />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </Step>

      <div className="space-y-3 border-t border-rule pt-6">
        <Button type="submit" loading={isLoading} className="w-full py-3 text-base">
          {!isLoading && <Search size={18} aria-hidden />}
          Find matching jobs
        </Button>
        <p className="text-center text-xs text-ink-2">Usually takes 20–60 seconds</p>
        {missing.length > 0 && (
          <p role="alert" className="text-center text-sm text-miss-text">
            Still needed: {missing.join(", ")}.
          </p>
        )}
        {error && <p className="text-center text-sm text-miss-text">{error}</p>}
      </div>
    </form>
  );
}
