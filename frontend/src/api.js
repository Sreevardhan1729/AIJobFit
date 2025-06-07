import axios from "axios";

const API_URL = 'https://sreevardhan1729-aijobfit-backend.hf.space';

const getJobSkills = async (jobDescription) => {
    try {
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        const response = await axios.post(`${API_URL}/jobdetails`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching Job Details", error);
        throw error;
    }
};

const getComparison = async(resume, jobDescription) => {
    try{
        const formData = new FormData();
        formData.append('job_description',jobDescription)
        formData.append('resume',resume)
        const response = await axios.post(`${API_URL}/compare`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data
    } catch (error){
        console.log("Error fetching Job Details", error);
        throw error;
    }
}

const getJobs = async({SITE,search_term,country,city,job_type,resumeFile}) => {
    try{
        const formData = new FormData()
        SITE.forEach((site) => formData.append('SITE',site));
        formData.append('search_term',search_term);
        formData.append('country',country);
        formData.append('city',city);
        formData.append('job_type',job_type);
        formData.append('resume',resumeFile);

        const response = await axios.post(`${API_URL}/getJobs`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data
    }
    catch (error){
        console.log("Error fetching Job Details", error);
        throw error;
    }
}

const moduleExports = {
    getComparison,
    getJobSkills,
    getJobs
  };
  
  export default moduleExports;
  