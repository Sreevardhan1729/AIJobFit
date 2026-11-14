import { useState } from "react";
import * as api from "../api";
import type { JobResult } from "../types";

export interface JobSearchInput {
  selectedSites: string[];
  searchTerm: string;
  country: string;
  city: string;
  jobType: string;
  resumeFile: File | null;
  resumeId?: string;
}

export function useJobSearch() {
  const [jobsResult, setJobsResult] = useState<JobResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // The last search that returned results, shown in the compact summary bar.
  const [lastSearch, setLastSearch] = useState<JobSearchInput | null>(null);

  // Resolves to true when results arrived, so the page knows whether to collapse the form.
  const search = async (params: JobSearchInput): Promise<boolean> => {
    const { selectedSites, searchTerm, country, city, jobType, resumeFile, resumeId } = params;
    setError("");

    if (
      selectedSites.length === 0 ||
      !searchTerm.trim() ||
      !country.trim() ||
      !city.trim() ||
      !jobType.trim() ||
      (!resumeFile && !resumeId)
    ) {
      setError("Please fill in all fields and select at least one site.");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await api.getJobs({
        SITE: selectedSites,
        search_term: searchTerm,
        country,
        city,
        job_type: jobType,
        resumeFile,
        resume_id: resumeId,
      });
      setJobsResult(response);
      setLastSearch(params);
      setSubmitted(true);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { jobsResult, isLoading, error, submitted, lastSearch, search };
}
