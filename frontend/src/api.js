import axios from "axios";

const API_URL = 'https://flask-hello-world-u7ol.onrender.com';

const getJobSkills = async (jobDescription) => {
    try {
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        const response = await axios.post(`${API_URL}/jobdetails`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Ensure Content-Type is set for form data
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching Job Details", error);
        throw error;
    }
};

const getComparision = async(resume, jobDescription) => {
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


const moduleExports = {
    getComparision,
    getJobSkills
  };
  
  export default moduleExports;
  