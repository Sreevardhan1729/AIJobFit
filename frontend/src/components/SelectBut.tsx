import React from "react";
import JobDImage from "../images/JobD.jpeg";
import CompareImage from "../images/Compare.jpg";
import { useNavigate } from "react-router-dom";

export default function SelectBut() {
  const navigate = useNavigate();

  return (
    <section id="features" className="mt-16 text-gray-600">
      <div className="container mx-auto px-5 py-16">
        <div className="-mx-4 -mb-10 flex flex-wrap text-center">
          <div className="mb-10 px-4 sm:w-1/2">
            <div className="h-64 overflow-hidden rounded-lg">
              <img alt="content" className="h-full w-full object-cover object-center" src={JobDImage} />
            </div>
            <h2 className="mt-6 mb-3 text-2xl font-medium text-gray-900">Find Job Requirements</h2>
            <p className="text-base leading-relaxed">
              Upload a job description to quickly extract and analyze key skills and qualifications
              required for the role.
            </p>
            <button
              className="mx-auto mt-6 flex rounded bg-indigo-500 px-5 py-2 text-white hover:bg-indigo-600 focus:outline-none"
              onClick={() => navigate("/job")}
            >
              Reveal Role Essentials
            </button>
          </div>

          <div className="mb-10 px-4 sm:w-1/2">
            <div className="h-64 overflow-hidden rounded-lg">
              <img alt="content" className="h-full w-full object-cover object-center" src={CompareImage} />
            </div>
            <h2 className="mt-6 mb-3 text-2xl font-medium text-gray-900">
              Compare Resume with Job Description
            </h2>
            <p className="text-base leading-relaxed">
              Match your resume against a job posting to identify missing skills and improve your
              chances of getting hired.
            </p>
            <button
              className="mx-auto mt-6 flex rounded bg-indigo-500 px-5 py-2 text-white hover:bg-indigo-600 focus:outline-none"
              onClick={() => navigate("/resume_job")}
            >
              Resume Skill Scan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
