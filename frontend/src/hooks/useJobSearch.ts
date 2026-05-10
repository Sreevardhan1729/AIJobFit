import { useState } from "react";
import * as api from "../api";
import type { JobResult } from "../types";

export function useJobSearch() {
  const [jobsResult, setJobsResult] = useState<JobResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const search = async (params: {
    selectedSites: string[];
    searchTerm: string;
    country: string;
    city: string;
    jobType: string;
    resumeFile: File | null;
    resumeId?: string;
  }) => {
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
      return;
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
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setJobsResult([]);
  };

  return { jobsResult, isLoading, error, submitted, search, reset };
}
