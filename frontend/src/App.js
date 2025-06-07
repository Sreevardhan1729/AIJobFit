import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Job from './Pages/Job';
import ResumeJob from './Pages/ResumeJob';
import GetJobs from './Pages/GetJobs';
import JobDetailsPage from './Pages/JobDetailsPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  

  return (
    <div>
      <Routes>
          <Route index element={<Home />} /> 
          <Route path="/job" element={<Job />} />
          <Route path="/resume_job" element={<ResumeJob />} />
          <Route path="/get_jobs" element={<GetJobs />} />
          <Route path="/get_jobs/:id" element={<JobDetailsPage />} />
      </Routes>
      
    </div>
  );
};

export default App;
