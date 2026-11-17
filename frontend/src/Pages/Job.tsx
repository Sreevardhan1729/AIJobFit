import React, { useState } from "react";
import * as api from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
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
      <h1 className="font-serif text-4xl font-medium text-ink">Analyze a job description</h1>
      <p className="mt-3 max-w-2xl text-ink-2">
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
                className="text-sm font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
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
            {error && <p className="text-sm text-miss-text">{error}</p>}
          </div>
        </form>
      </Card>

      {jobDetails && (
        <div className="mt-8 space-y-4">
          {groups.length === 0 ? (
            <Card>
              <p className="text-sm text-ink-2">No skills or requirements found in this job description.</p>
            </Card>
          ) : (
            groups.map(([key, values]) => (
              <Card key={key}>
                <h2 className="mb-3 font-serif text-xl font-medium text-ink">
                  {LABEL_NAMES[key] ?? key}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <li
                      key={value}
                      className={`rounded-[3px] border px-2.5 py-1 text-sm text-ink ${
                        key === "Required Skills" ? "border-ink font-medium" : "border-rule"
                      }`}
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
