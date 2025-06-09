import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Badge = ({ children, variant = "secondary", className = "" }) => {
  const base =
    "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium shadow transition-colors";
  const variants = {
    secondary: "bg-gray-100 text-gray-700",
    highlight: "bg-gradient-to-r from-blue-600 to-violet-600 text-white",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
  );
};


const formatDescription = (raw = "") => {
  let html = raw.trim();
  if (!html) return "";

  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>'
    )
    .replace(/\n\s*\n/g, "</p><p>")
    .replace(/\n/g, "<br />");

  return `<p>${html}</p>`;
};


const JobDetailsPage = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  const { state } = useLocation();
  const { id } = useParams();
  const jobFromState = state?.job;

  const jobFromStorage = (() => {
    const raw = localStorage.getItem(`handoff:${id}`);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed.id?.toString() === id ? parsed : null;
    } catch {
      return null;
    }
  })();

  const [job, setJob] = useState(jobFromState || jobFromStorage);
  const [showDesc, setShowDesc] = useState(true);
  const [selectedUncommon, setSelectedUncommon] = useState(new Set());



  useEffect(() => {
    if (jobFromStorage) localStorage.removeItem(`handoff:${id}`);
  }, [jobFromStorage, id]);


  const commonCount = job?.common_skills?.length ?? 0;
  const selectedCount = selectedUncommon.size;
  const totalUncommon = job?.uncommon_skills?.length ?? 0;
  const remainingUncommon = totalUncommon - selectedCount;

  const score = useMemo(() => {
    const numerator = commonCount * 2 + selectedCount * 2 + 1;
    const denominator = commonCount * 2 + selectedCount * 2 + remainingUncommon + 1;
    return Math.round((numerator / denominator) * 100);
  }, [commonCount, selectedCount, remainingUncommon]);


  const toggleSkill = (skill) =>
    setSelectedUncommon((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });


  if (!job) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-gray-600">Loading job details…</p>
      </div>
    );
  }



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-rose-50 to-violet-50 p-4 md:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative isolate overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-lg"
        >

          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-violet-500/20 blur-3xl" />

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              {job.logo_url ? (
                <img
                  src={job.logo_url}
                  alt="logo"
                  className="h-14 w-14 rounded-xl object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow-lg">
                  {job.company?.[0] ?? "?"}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    {job.title}
                  </span>
                </h1>
                <p className="mt-1 text-gray-600">{job.company}</p>
              </div>
            </div>

            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Apply Now
            </a>
          </div>
        </motion.div>


        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-2 flex flex-wrap gap-3 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur">
            <Badge>{job.site}</Badge>
            {job.location && <Badge>{job.location}</Badge>}
            {job.job_type && <Badge>{job.job_type}</Badge>}
            {job.date_posted && (
              <Badge>
                Posted&nbsp;
                {new Date(job.date_posted).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Badge>
            )}
          </div>

          <motion.div
            key={score}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 shadow-lg backdrop-blur"
          >
            <span className="text-4xl font-extrabold text-emerald-600">{score}%</span>
            <span className="ml-2 text-sm font-medium text-emerald-700">Match</span>
          </motion.div>
        </div>


        <div className="mt-6 rounded-3xl bg-white p-6 shadow">
          <button
            onClick={() => setShowDesc((v) => !v)}
            className="flex w-full items-center justify-between text-left text-lg font-medium text-gray-800"
          >
            Job Description
            {showDesc ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <AnimatePresence initial={false}>
            {showDesc && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="prose prose-sm mt-4 max-w-none max-h-64 overflow-y-auto pr-2 text-gray-600"
                dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SkillBox
            title="Common Skills"
            skills={job.common_skills}
            badgeClass="bg-emerald-100 text-emerald-700"
            type="common"
          />
          <SkillBox
            title="Uncommon Skills (click to add)"
            skills={job.uncommon_skills}
            badgeClass="bg-rose-100 text-rose-700"
            type="uncommon"
            toggledSet={selectedUncommon}
            onToggle={toggleSkill}
          />
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handleNavigation('/get_jobs')}
            className="px-12 py-3 bg-gray-300 text-gray-800 rounded-lg text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────  SUB-COMPONENT  ──────────────────────────── */

const SkillBox = ({
  title,
  skills,
  badgeClass,
  type,
  toggledSet = new Set(),
  onToggle,
}) => (
  <div className="rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
      {title}
      {type === "uncommon" && (
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-rose-500" />
        </span>
      )}
    </h3>

    {skills && skills.length > 0 ? (
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const isSelected = toggledSet.has(skill);
          const base = isSelected ? "bg-emerald-100 text-emerald-700" : badgeClass;
          const pulse = !isSelected && type === "uncommon" ? "animate-pulse" : "";

          return (
            <motion.li
              key={skill}
              whileTap={{ scale: 0.9 }}
              onClick={type === "uncommon" ? () => onToggle(skill) : undefined}
              className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow transition-transform duration-150 hover:-translate-y-0.5 ${base} ${pulse} ${
                type === "uncommon" ? "ring-1 ring-rose-300 hover:ring-2" : ""
              }`}
            >
              {type === "uncommon" && !isSelected && <Plus size={12} />}
              {type === "uncommon" && isSelected && <Check size={12} />}
              {skill}
            </motion.li>
          );
        })}
      </ul>
    ) : (
      <p className="text-sm text-gray-500">No data</p>
    )}
  </div>
);

export default JobDetailsPage;
