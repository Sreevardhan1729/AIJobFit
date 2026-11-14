import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useJobSearch } from "../hooks/useJobSearch";
import type { JobSearchInput } from "../hooks/useJobSearch";
import JobSearchForm from "../components/JobSearchForm";
import JobCard from "../components/JobCard";
import SkillGapPanel from "../components/SkillGapPanel";
import SearchProgress from "../components/SearchProgress";
import Button from "../components/ui/Button";
import { JOB_TYPES, SITE_OPTIONS } from "../constants";
import { jobMissesSkill } from "../lib/match";

function describeSearch(search: JobSearchInput): string {
  const jobType = JOB_TYPES.find((jt) => jt.value === search.jobType)?.label ?? search.jobType;
  const sites = SITE_OPTIONS.filter((opt) => search.selectedSites.includes(opt.value)).map((opt) => opt.label);
  const resume = search.resumeFile?.name ?? "saved resume";
  return [search.searchTerm, jobType, `${search.city}, ${search.country}`, sites.join(" + "), resume].join(" · ");
}

export default function GetJobs() {
  const { jobsResult, isLoading, error, submitted, lastSearch, search } = useJobSearch();
  const [gapFilter, setGapFilter] = useState<string | null>(null);
  // After results load, the form collapses into the summary bar; "Edit search" reopens it.
  const [editing, setEditing] = useState(false);
  const showForm = !submitted || editing;

  const visibleJobs = gapFilter ? jobsResult.filter((job) => jobMissesSkill(job, gapFilter)) : jobsResult;

  const handleSearch = async (params: JobSearchInput) => {
    const ok = await search(params);
    if (ok) {
      setGapFilter(null);
      setEditing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">Job search</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Find jobs ranked by how well you fit</h1>
        <p className="mx-auto mt-2 max-w-2xl text-slate-400">
          Fresh LinkedIn and Indeed postings, each scored against your resume.
        </p>
      </div>

      {submitted && lastSearch && (
        <div className="mx-auto mb-6 flex w-full max-w-4xl flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
          <Search size={18} aria-hidden className="shrink-0 text-indigo-300" />
          <p className="min-w-0 flex-1 text-sm text-slate-200">{describeSearch(lastSearch)}</p>
          <Button variant="secondary" aria-expanded={editing} onClick={() => setEditing((open) => !open)}>
            {editing ? "Close" : "Edit search"}
          </Button>
        </div>
      )}

      <div hidden={!showForm} className="mb-8">
        <JobSearchForm onSubmit={handleSearch} isLoading={isLoading} error={error} />
      </div>

      {isLoading && <SearchProgress />}

      {submitted && <SkillGapPanel jobs={jobsResult} selected={gapFilter} onSelect={setGapFilter} />}

      {submitted && jobsResult.length === 0 && (
        <p className="text-center text-slate-400">No jobs found. Try a different search.</p>
      )}

      <div className="flex flex-col items-center gap-4">
        <AnimatePresence>
          {submitted &&
            visibleJobs.map((job, idx) => (
              <JobCard key={job.id ?? idx} index={idx} job={job} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
