import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PageErrorFallback from "./components/PageErrorFallback";
import Home from "./Pages/Home";
import Job from "./Pages/Job";
import ResumeJob from "./Pages/ResumeJob";
import GetJobs from "./Pages/GetJobs";
import JobDetailsPage from "./Pages/JobDetailsPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

export default function App() {
  return (
    <ErrorBoundary fallback={<PageErrorFallback />}>
      <AuthProvider>
        <Routes>
          <Route index element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/job" element={<ErrorBoundary><Job /></ErrorBoundary>} />
          <Route path="/resume_job" element={<ErrorBoundary><ResumeJob /></ErrorBoundary>} />
          <Route path="/get_jobs" element={<ErrorBoundary><GetJobs /></ErrorBoundary>} />
          <Route path="/get_jobs/:id" element={<ErrorBoundary><JobDetailsPage /></ErrorBoundary>} />
          <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
          <Route path="/signup" element={<ErrorBoundary><Signup /></ErrorBoundary>} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}
