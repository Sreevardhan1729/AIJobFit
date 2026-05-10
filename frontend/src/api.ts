import axios from "axios";
import type { AuthResponse, User, ResumeListResponse, Resume, JobResult, JobSearchParams } from "./types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:7860";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getJobSkills(jobDescription: string): Promise<Record<string, string[]>> {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  const response = await api.post("/jobdetails", formData);
  return response.data;
}

export async function getComparison(
  resume: File | null,
  jobDescription: string,
  resumeId?: string
): Promise<[string[], string[]]> {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  if (resumeId) {
    formData.append("resume_id", resumeId);
  } else if (resume) {
    formData.append("resume", resume);
  }
  const response = await api.post("/compare", formData);
  return response.data;
}

export async function getJobs(params: JobSearchParams): Promise<JobResult[]> {
  const formData = new FormData();
  params.SITE.forEach((site) => formData.append("SITE", site));
  formData.append("search_term", params.search_term);
  formData.append("country", params.country);
  formData.append("city", params.city);
  formData.append("job_type", params.job_type);
  if (params.resume_id) {
    formData.append("resume_id", params.resume_id);
  } else if (params.resumeFile) {
    formData.append("resume", params.resumeFile);
  }
  const response = await api.post("/getJobs", formData);
  return response.data;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post("/auth/signup", { email, password });
  return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function listResumes(): Promise<ResumeListResponse> {
  const response = await api.get("/resumes");
  return response.data;
}

export async function uploadResume(file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await api.post("/resumes", formData);
  return response.data;
}

export async function deleteResume(resumeId: string): Promise<void> {
  await api.delete(`/resumes/${resumeId}`);
}
