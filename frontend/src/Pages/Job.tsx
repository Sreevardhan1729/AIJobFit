import React, { useState } from "react";
import * as api from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Chip from "../components/ui/Chip";
import { FIELD, LABEL } from "../components/ui/fieldStyles";
import { SAMPLE_JOB_TEXT } from "../data/sampleJob";

// Display names for the model's labels; anything else is shown as-is.
const LABEL_NAMES: Record<string, string> = {
  EDUCATION: "Education",
  SOFTSKILLS: "Soft skills",
  LANGUAGE: "Languages",
  DOMAIN: "Domain",
  DEVELOP: "Development",
  RESPONSIBILITY: "Responsibilities",
};

const FIRST_GROUPS = ["Required Skills", "Preferred Skills", "Experience"];

function orderedGroups(details: Record<string, string[]>): [string, string[]][] {
  const rank = (key: string) => (FIRST_GROUPS.includes(key) ? FIRST_GROUPS.indexOf(key) : FIRST_GROUPS.length);
  return Object.entries(details).sort(([a], [b]) => rank(a) - rank(b));
}

export default function Job() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobDetails, setJobDetails] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setJobDetails(null);
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.getJobSkills(jobDescription);
      setJobDetails(data);
    } catch {
      setError("Error fetching job details");
    } finally {
      setLoading(false);
    }
  };

  const groups = jobDetails ? orderedGroups(jobDetails) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">Analyze</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-100">Analyze a job description</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Pull out the required and preferred skills, the experience asked for, and the other requirements.
      </p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="analyze-job" className={`${LABEL} mb-0`}>
                Job description
              </label>
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_TEXT)}
                className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
              >
                Use the sample job
              </button>
            </div>
            <textarea
              id="analyze-job"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the job description here"
              className={`${FIELD} leading-relaxed`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={loading}>
              Analyze job
            </Button>
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </div>
        </form>
      </Card>

      {jobDetails && (
        <div className="mt-8 space-y-4">
          {groups.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-400">No skills or requirements found in this job description.</p>
            </Card>
          ) : (
            groups.map(([key, values]) => (
              <Card key={key}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  {LABEL_NAMES[key] ?? key}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <Chip key={value} tone={key === "Required Skills" ? "brand" : "neutral"}>
                      {value}
                    </Chip>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
