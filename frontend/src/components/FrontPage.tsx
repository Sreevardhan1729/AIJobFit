import React from "react";
import FrontImage from "../images/FrontPage.png";
import { useNavigate } from "react-router-dom";

export default function FrontPage() {
  const navigate = useNavigate();

  return (
    <section id="home" className="pt-32 text-gray-600">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-10 py-32 md:flex-row">
        <div className="mb-16 flex flex-col text-left md:mb-0 md:w-1/2 md:pr-20 lg:flex-grow lg:pr-32">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
            Find Jobs That Fit You, Not Just Keywords.
          </h1>
          <p className="mb-10 text-lg leading-relaxed">
            Find jobs that match your skills in seconds! Our AI analyzes your resume and connects
            you with the perfect opportunities.
          </p>
          <p>Get started to upload your Resume</p>
          <div className="flex">
            <button
              onClick={() => navigate("/get_jobs")}
              className="inline-flex rounded-lg bg-indigo-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-600"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
          <img
            className="h-auto w-full rounded-lg object-cover object-center shadow-lg"
            alt="hero"
            src={FrontImage}
          />
        </div>
      </div>
    </section>
  );
}
