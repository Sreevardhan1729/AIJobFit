import {useState} from 'react'
import moduleExports from '../api';
import { useNavigate } from 'react-router-dom';

import "../index.css"

const Job = () => {
  const navigate = useNavigate()
  const {getJobSkills} = moduleExports
    const [jobDescription, setJobDescription]  = useState('')
    const [jobDetails, setJobDetails] = useState(null);
    const [error, setError] = useState('')

    const adjustTextareaSize = (textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
      };
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setJobDetails('')
        if(!jobDescription.trim()){
          setError("Please enter Job Description")
        }
        try{
            const data = await getJobSkills(jobDescription);
            setJobDetails(data)

        } catch(err){
            setError("Error Fetching Job Details")
        }
    }
    const handleBackClick = ()=> {
      navigate('/')
    }
    return (
      <div className="max-w-screen-md mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Analyze Job Requirements
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Description Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Job Description:
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                adjustTextareaSize(e.target);
              }}
              onInput={(e) => adjustTextareaSize(e.target)}
              rows="6"
              cols="50"
              placeholder="Paste the Job Description Here"
              style={{
                minHeight: "100px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
            />
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Get Your Dream Job
          </button>
        </form>
  
        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-4">
            {error}
          </p>
        )}
  
        {/* Display Job Details */}
        {jobDetails && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Job Requirements</h2>
            {Object.keys(jobDetails).map((key) => (
              <div key={key} className="mb-6">
                <h3 className="text-xl font-medium text-gray-800">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h3>
                {jobDetails[key].length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {jobDetails[key].map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No {key} found.</p>
                )}
              </div>
            ))}
          </div>
        )}
  
        {/* Back Button */}
        <button
          className="mt-8 inline-flex items-center px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={handleBackClick}
        >
          Back to Home
        </button>
      </div>
    );
}
export default Job