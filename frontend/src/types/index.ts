export interface User {
  id: string;
  email: string;
}

export interface Resume {
  id: string;
  filename: string;
  extracted_skills: string[];
  uploaded_at: string;
  is_active: boolean;
}

export interface ResumeListResponse {
  resumes: Resume[];
  max_resumes: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface JobResult {
  id: string;
  site: string;
  job_url: string;
  title: string;
  company: string;
  location: string;
  date_posted: string;
  description: string;
  job_type: string;
  similarity_score: number;
  common_skills: string[];
  uncommon_skills: string[];
  logo_url?: string;
}

export interface JobSearchParams {
  SITE: string[];
  search_term: string;
  country: string;
  city: string;
  job_type: string;
  resumeFile?: File | null;
  resume_id?: string;
}
