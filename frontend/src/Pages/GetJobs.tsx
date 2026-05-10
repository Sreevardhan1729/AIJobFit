import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useJobSearch } from "../hooks/useJobSearch";
import JobSearchForm from "../components/JobSearchForm";
import JobCard from "../components/JobCard";

export default function GetJobs() {
  const navigate = useNavigate();
  const { jobsResult, isLoading, error, submitted, search, reset } = useJobSearch();

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

      <div className="flex flex-wrap justify-center gap-6">
        <AnimatePresence>
          {submitted &&
            jobsResult.map((job, idx) => (
              <JobCard key={job.id ?? idx} index={idx} job={job} />
            ))}
        </AnimatePresence>
      </div>

      {submitted && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-gray-300 px-12 py-3 text-sm text-gray-800 shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
