import { useState} from 'react'
import moduleExports from '../api'
import { useNavigate } from 'react-router-dom';

import "../index.css"

const ResumeJob = () => {
    const navigate = useNavigate()
    const { getComparison } = moduleExports;
    const [resumeFile,setResumeFile] = useState(null)
    const [jobDescription,setJobDescription] = useState('')
    const [error,setError] = useState('')
    const [result,setResult] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError('')
        setResult(null)

        if(!resumeFile){
            setError('Please Upload a resume PDF.');
            return;
        }
        if(!jobDescription){
            setError('Please Upload a Job Description PDF.');
            return ;
        }
        try{
            const data = await getComparison(resumeFile,jobDescription)
            setResult(data)
            setSubmitted(true)
        } catch(err){
            setError('Error Fetching Prediction')
        }
    }

    const adjustTextareaSize = (textarea) => {
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight,300) + "px"
    }
    const handleBackClick = () => {
      navigate('/')
    }
    return (
      <div className="max-w-screen-md mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Skill Comparison</h1>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Upload Resume (PDF):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
            />
          </div>
  
          {/* Job Description Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Job Description</label>
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
  
          {/* Compare Button */}
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Compare Skills
          </button>
        </form>
  
        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
  
        {/* Display Results */}
        {submitted && result && (
          <div className="mt-8 space-y-6">
            {/* Skills in Common */}
            {result[0] && result[0].length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Skills in Common</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {result[0].map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-orange-500 mb-2">No Skills are Common</h3>
              </div>
            )}
  
            {/* Skills to Add */}
            {result[1] && result[1].length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Skills Need to be Added</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {result[1].map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">All Skills Already Present</h3>
              </div>
            )}
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
export default ResumeJob