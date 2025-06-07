import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moduleExports from "../api"
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const siteOptions = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Indeed', value: 'indeed' },

];

const cityOptionsByCountry = {
  India: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
  USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo'],
};

const JobCard = ({ job, index, jobType }) => {
  const navigate = useNavigate();

  return (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="relative w-[700px] h-[160px] overflow-hidden rounded-3xl bg-white p-6 shadow-lg"
  >
    <button
      type="button"
      onClick={() => navigate(`/get_jobs/${job.id}`, { state: { job } })}
      className="absolute top-6 right-6 rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 backdrop-blur transition-colors duration-200 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      More Details
    </button>

    <div className="space-y-1 max-w-[60%]">
      <div className="flex items-center gap-3">
        <h2 className="truncate text-xl font-semibold leading-tight text-gray-800">
          { job.title}
        </h2>
        <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-xs font-medium text-emerald-700 backdrop-blur">
          { job.job_type || jobType}
        </span>
      </div>
      <p className="truncate text-sm text-gray-500">
        { job.company} • { job.location}
      </p>
    </div>

    <span className="absolute bottom-6 left-6 inline-flex items-center rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
      {job.similarity_score} %Match
    </span>

    <a
      href={job.job_url}  target="_blank" rel="noopener noreferrer"
      className="absolute bottom-6 right-6 inline-flex items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      Apply Now
    </a>
  </motion.div>
);}


const GetJobs = () => {
  const navigate = useNavigate();

  const { getJobs } = moduleExports;

  const [selectedSites, setSelectedSites] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [jobType, setJobType] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [jobsResult, setJobsResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };


  const handleSiteToggle = (value) => {
    setSelectedSites((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };


  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setCity('');
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      selectedSites.length === 0 ||
      !searchTerm.trim() ||
      !country.trim() ||
      !city.trim() ||
      !jobType.trim() ||
      !resumeFile
    ) {
      setError('Please fill in all fields and select at least one site.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await getJobs({SITE: selectedSites,search_term: searchTerm,country,city,job_type: jobType,resumeFile})
      setSubmitted(true);

      setJobsResult(response)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const availableCities = country ? cityOptionsByCountry[country] : [];

  return (
    <div className="max-w-screen-xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Job Search
      </h1>

      <AnimatePresence>
      {!submitted && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.4 } }}
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden"
          >
        <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Custom Multi-Select “Select Sites” */}
              <div ref={dropdownRef} className="relative">
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Select Sites:
                </label>
                <div
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 text-sm cursor-pointer flex justify-between items-center bg-gray-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
                  onClick={handleDropdownToggle}
                >
                  <span>
                    {selectedSites.length > 0
                      ? siteOptions
                          .filter((opt) => selectedSites.includes(opt.value))
                          .map((opt) => opt.label)
                          .join(', ')
                      : 'Choose sites'}
                  </span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    } text-gray-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                    {siteOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          value={opt.value}
                          checked={selectedSites.includes(opt.value)}
                          onChange={() => handleSiteToggle(opt.value)}
                          className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                        />
                        <span className="ml-3 text-gray-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {/* Job Title / Search Term */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Job Title / Keyword:
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 text-sm bg-gray-50"
                />
              </div>
              {/* Country (only India, USA, Japan) */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Country:
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={handleCountryChange}
                    className="
                      appearance-none w-full bg-white border border-gray-300 rounded-lg 
                      py-3 px-3 text-gray-700 text-sm font-medium
                      shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 
                      transition-colors
                    "
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="Japan">Japan</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* City (populates based on selected country) */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  City:
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!country} 
                    className={`
                      appearance-none w-full bg-white border ${
                        country ? 'border-gray-300' : 'border-gray-200 bg-gray-100'
                      } rounded-lg py-3 px-3 text-gray-700 text-sm font-medium
                      shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 
                      transition-colors
                    `}
                  >
                    <option value="" disabled>
                      {country ? 'Select City' : 'Choose country first'}
                    </option>
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                  <svg
                    className={`
                      pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                        country ? 'text-gray-400' : 'text-gray-300'
                      }
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Job Type */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Job Type:
                </label>
                <div className="relative">
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="
                      appearance-none w-full bg-white border border-gray-300 rounded-lg 
                      py-3 px-3 text-gray-700 text-sm font-medium
                      shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 
                      transition-colors
                    "
                  >
                    <option value="" disabled>
                      Select Job Type
                    </option>
                    <option value="internship">Internship</option>
                    <option value="fulltime">Full-Time</option>
                    <option value="parttime">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Resume Upload (full width on small+) */}
              <div className="sm:col-span-2">
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Upload Resume (PDF):
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer text-sm bg-gray-50"
                />
              </div>
            </div>
            {/* Submit & Back Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-12 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Loading...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>

              <button
                type="button"
                onClick={handleBackClick}
                className="inline-flex items-center px-12 py-3 bg-gray-300 text-gray-800 rounded-lg text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
              >
                Back
              </button>
            </div>
            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </motion.form>
      )}
      </AnimatePresence>
      {/* Results */}
      <div className="flex flex-wrap justify-center gap-6">
        <AnimatePresence>
          {submitted &&
            jobsResult.map((job, idx) => (
                <JobCard
                  key={job.id ?? idx}
                  index={idx}
                  job={job}
                />
              ))
          }
        </AnimatePresence>
      </div>
      {/* Back Button */}
      {submitted && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setSubmitted(false);
              setResumeFile(null);
            }}
            className="px-12 py-3 bg-gray-300 text-gray-800 rounded-lg text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};


export default GetJobs;


