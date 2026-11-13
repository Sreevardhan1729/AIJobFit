import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useJobSearch } from "../hooks/useJobSearch";
import JobSearchForm from "../components/JobSearchForm";
import JobCard from "../components/JobCard";
import SkillGapPanel from "../components/SkillGapPanel";
import { jobMissesSkill } from "../lib/match";

export default function GetJobs() {
  const navigate = useNavigate();
  const { jobsResult, isLoading, error, submitted, search, reset } = useJobSearch();
  const [gapFilter, setGapFilter] = useState<string | null>(null);

  const visibleJobs = gapFilter ? jobsResult.filter((job) => jobMissesSkill(job, gapFilter)) : jobsResult;

  const handleBack = () => {
    setGapFilter(null);
    reset();
  };

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">Job Search</h1>

      <AnimatePresence>
        {!submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.4 } }}
          >
            <JobSearchForm
              onSubmit={search}
              isLoading={isLoading}
              error={error}
              onBack={() => navigate("/")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {submitted && <SkillGapPanel jobs={jobsResult} selected={gapFilter} onSelect={setGapFilter} />}

      {submitted && jobsResult.length === 0 && (
        <p className="text-center text-gray-600">No jobs found. Try a different search.</p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        <AnimatePresence>
          {submitted &&
            visibleJobs.map((job, idx) => (
              <JobCard key={job.id ?? idx} index={idx} job={job} />
            ))}
        </AnimatePresence>
      </div>

      {submitted && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleBack}
            className="rounded-lg bg-gray-300 px-12 py-3 text-sm text-gray-800 shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
