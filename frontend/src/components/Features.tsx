import React from "react";

export default function Features() {
  return (
    <section className="text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <div className="mb-20 text-center">
          <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl">
            Empowering Your Job Search with AI
          </h1>
          <p className="mx-auto text-base leading-relaxed text-gray-500 lg:w-3/4 xl:w-2/4">
            Finding the perfect job just got easier! Our AI-driven platform helps you analyze job
            descriptions, compare resumes, and even discover job opportunities that match your
            skills.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
          </div>
        </div>
        <div className="-mx-4 -mb-10 -mt-4 flex flex-wrap space-y-6 sm:-m-4 md:space-y-0">
          <div className="flex flex-col items-center p-4 text-center md:w-1/3">
            <div className="mb-5 inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-10 w-10" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="flex-grow">
              <h2 className="mb-3 text-lg font-medium text-gray-900">Extract Job Requirements Instantly</h2>
              <p className="text-base leading-relaxed">
                Upload a job description and get a detailed breakdown of required skills,
                qualifications, and responsibilities—helping you tailor your application for success.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center p-4 text-center md:w-1/3">
            <div className="mb-5 inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-10 w-10" viewBox="0 0 24 24">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
              </svg>
            </div>
            <div className="flex-grow">
              <h2 className="mb-3 text-lg font-medium text-gray-900">Compare Your Resume with Job Listings</h2>
              <p className="text-base leading-relaxed">
                See how well your resume aligns with a job description. Our AI highlights missing
                skills and improvements to boost your chances of landing an interview.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center p-4 text-center md:w-1/3">
            <div className="mb-5 inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-10 w-10" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-grow">
              <h2 className="mb-3 text-lg font-medium text-gray-900">Find Jobs That Match Your Skills</h2>
              <p className="text-base leading-relaxed">
                Upload your resume, and our AI will match your skills with the best job
                opportunities—bringing you closer to roles that truly fit your expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
