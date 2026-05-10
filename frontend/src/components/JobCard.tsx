import React from "react";
import { motion } from "framer-motion";
import type { JobResult } from "../types";

interface JobCardProps {
  job: JobResult;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  const handleDetails = () => {
    localStorage.setItem(`handoff:${job.id}`, JSON.stringify(job));
    window.open(`/get_jobs/${job.id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative h-[160px] w-[700px] overflow-hidden rounded-3xl bg-white p-6 shadow-lg"
    >
      <button
        type="button"
        onClick={handleDetails}
        className="absolute right-6 top-6 rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 backdrop-blur transition-colors duration-200 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        More Details
      </button>

      <div className="max-w-[60%] space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="truncate text-xl font-semibold leading-tight text-gray-800">
            {job.title}
          </h2>
          <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-xs font-medium text-emerald-700 backdrop-blur">
            {job.job_type}
          </span>
        </div>
        <p className="truncate text-sm text-gray-500">
          {job.company} &bull; {job.location}
        </p>
      </div>

      <span className="absolute bottom-6 left-6 inline-flex items-center rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
        {job.similarity_score}% Match
      </span>

      <a
        href={job.job_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 inline-flex items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        Apply Now
      </a>
    </motion.div>
  );
}
