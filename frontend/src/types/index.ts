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

export type SkillStatus = "matched" | "partial" | "missing";
export type Importance = "required" | "preferred";
export type FitStatus = "meets" | "below" | "unknown";

export interface SkillMatch {
  name: string;
  key: string;
  importance: Importance;
  weight: number;
  status: SkillStatus;
  credit: number;
  via: string | null;
  job_term: string;
  resume_term: string | null;
}

export interface Tip {
  skill: string;
  job_term: string;
  resume_term: string;
  message: string;
}

export interface MatchResult {
  score: number | null;
  skills: SkillMatch[];
  experience: { required_years: number | null; resume_years: number | null; status: FitStatus };
  education: { required_level: string | null; resume_level: string | null; status: FitStatus };
  tips: Tip[];
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
  // Optional: details handed off from an older build (localStorage) may not have it.
  match?: MatchResult;
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
