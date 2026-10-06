export type Role = 'student' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  technologies: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: number;
  experience_level: string;
  work_experience?: string;
  skills: string[];
  interests: string[];
  career_preferences: string[];
  projects: Project[];
  updated_at?: string;
}

export interface ScoreBreakdown {
  final_score: number;
  rule_score: number;
  skill_score: number;
  interest_score: number;
  branch_score: number;
  experience_score: number;
  eligibility_score: number;
  nlp_score: number;
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  type: 'Internship' | 'Hackathon' | 'Workshop' | 'Competition' | 'Certification';
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  eligible_branches: string[];
  minimum_year: number;
  maximum_year: number;
  experience_required: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  deadline: string;
  apply_url: string;
  is_demo: boolean;
  created_at?: string;
  match_score?: number;
  score_breakdown?: ScoreBreakdown;
  matched_skills?: string[];
  missing_skills?: string[];
  explanation?: string[];
  is_saved?: boolean;
  application_status?: 'Interested' | 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected' | null;
}

export interface Recommendation {
  opportunity_id: number;
  match_score: number;
  score_breakdown?: ScoreBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string[];
  opportunity: Opportunity;
}

export interface SkillGapItem {
  skill: string;
  demand_count: number;
  impact_statement: string;
  related_opportunities: string[];
}

export interface SkillGapData {
  skills_have: string[];
  skills_to_improve: SkillGapItem[];
  total_gap_count: number;
  top_recommendation: string;
}

export interface ApplicationItem {
  id: number;
  student_id: number;
  opportunity_id: number;
  status: 'Interested' | 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected';
  notes?: string;
  applied_at?: string;
  opportunity: Opportunity;
}

export interface SavedOpportunityItem {
  id: number;
  student_id: number;
  opportunity_id: number;
  created_at?: string;
  opportunity: Opportunity;
  match_score?: number;
}

export interface AdminStats {
  total_students: number;
  total_opportunities: number;
  total_applications: number;
  total_saved: number;
  avg_match_score: number;
  popular_skills: { name: string; count: number }[];
  opportunity_types: { type: string; count: number }[];
  application_statuses: { status: string; count: number }[];
  recent_applications: {
    id: number;
    student_name: string;
    opportunity_title: string;
    status: string;
    applied_at: string;
  }[];
}

export interface RegisteredStudent {
  id: number;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: number;
  skills: string[];
  skill_count: number;
  applications_count: number;
  saved_count: number;
  created_at: string;
}
