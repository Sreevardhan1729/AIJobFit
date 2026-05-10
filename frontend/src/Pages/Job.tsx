import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";

export default function Job() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [jobDetails, setJobDetails] = useState<Record<string, string[]> | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setJobDetails(null);
    if (!jobDescription.trim()) {
      setError("Please enter Job Description");
      return;
    }
    try {
      const data = await api.getJobSkills(jobDescription);
      setJobDetails(data);
    } catch {
      setError("Error fetching job details");
    }
  };

  return (
    <div className="mx-auto max-w-screen-md px-4 py-20">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Analyze Job Requirements</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block font-medium text-gray-700">Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the Job Description Here"
            className="w-full rounded border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            style={{ minHeight: "100px", maxHeight: "300px", overflowY: "auto" }}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded bg-indigo-500 px-6 py-2 text-white shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Get Your Dream Job
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {jobDetails && (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Job Requirements</h2>
          {Object.entries(jobDetails).map(([key, values]) => (
            <div key={key} className="mb-6">
              <h3 className="text-xl font-medium text-gray-800">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </h3>
              {values.length > 0 ? (
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {values.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No {key} found.</p>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        className="mt-8 inline-flex items-center rounded bg-gray-300 px-6 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
