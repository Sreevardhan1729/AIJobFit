import React, { useState } from "react";
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
      <div className="mx-auto mb-8 max-w-4xl">
        <h1 className="font-serif text-4xl font-medium text-ink">Find jobs ranked by how well you fit</h1>
        <p className="mt-3 max-w-2xl text-ink-2">
          Fresh LinkedIn and Indeed postings, each scored against your resume.
        </p>
      </div>

      {submitted && lastSearch && (
        <div className="mx-auto mb-6 flex w-full max-w-4xl flex-wrap items-center gap-3 border-y border-ink py-3">
          <p className="min-w-0 flex-1 text-sm text-ink">{describeSearch(lastSearch)}</p>
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
        <p className="text-center text-ink-2">No jobs found. Try a different search.</p>
      )}

      <div className="flex flex-col items-center gap-4">
        {submitted && visibleJobs.map((job, idx) => <JobCard key={job.id ?? idx} job={job} />)}
      </div>
    </div>
  );
}
