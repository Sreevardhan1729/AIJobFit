import React from "react"
import JobDImage from "../images/JobD.jpeg"
import CompareImgae from "../images/Compare.jpg"
import { useNavigate } from "react-router-dom";

const SelectBut = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
      navigate(path);
    };
    return (
        <section id="features" className="text-gray-600 body-font mt-16">
            <div className="container px-5 py-16 mx-auto">
                <div className="flex flex-wrap -mx-4 -mb-10 text-center">
                    
                    {/* First Box */}
                    <div className="sm:w-1/2 mb-10 px-4">
                        <div className="rounded-lg h-64 overflow-hidden">
                            <img alt="content" className="object-cover object-center h-full w-full" src={JobDImage} />
                        </div>
                        <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Find Job Requirements</h2>
                        <p className="leading-relaxed text-base">Upload a job description to quickly extract and analyze key skills and qualifications required for the role.</p>
                        <button className="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded" onClick={()=>handleNavigation('/job')}>Reveal Role Essentials</button>
                    </div>

                    {/* Second Box */}
                    <div className="sm:w-1/2 mb-10 px-4">
                        <div className="rounded-lg h-64 overflow-hidden">
                            <img alt="content" className="object-cover object-center h-full w-full" src={CompareImgae} />
                        </div>
                        <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Compare Resume with Job Description</h2>
                        <p className="leading-relaxed text-base">Match your resume against a job posting to identify missing skills and improve your chances of getting hired.</p>
                        <button className="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded" onClick={()=>handleNavigation('/resume_job')}>Resume Skill Scan</button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SelectBut;
