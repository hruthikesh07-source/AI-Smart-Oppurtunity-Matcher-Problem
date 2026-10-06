import axios from 'axios';
import {
  User,
  StudentProfile,
  Opportunity,
  Recommendation,
  SkillGapData,
  ApplicationItem,
  SavedOpportunityItem,
  AdminStats,
  RegisteredStudent,
  Project
} from '../types';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on protected route, clean up token
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<{ access_token: string; token_type: string; user: User }>('/auth/login', credentials);
    return res.data;
  },
  register: async (data: { name: string; email: string; password: string; college?: string; branch?: string; year?: number }) => {
    const res = await apiClient.post<{ access_token: string; token_type: string; user: User }>('/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  }
};

// Profile Endpoints
export const profileService = {
  getProfile: async () => {
    const res = await apiClient.get<StudentProfile>('/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<StudentProfile>) => {
    const res = await apiClient.put<StudentProfile>('/profile', data);
    return res.data;
  },
  getAllSkills: async () => {
    const res = await apiClient.get<{ id: number; name: string }[]>('/skills');
    return res.data;
  },
  addProject: async (project: Omit<Project, 'id'>) => {
    const res = await apiClient.post<Project>('/projects', project);
    return res.data;
  },
  deleteProject: async (projectId: number) => {
    const res = await apiClient.delete(`/projects/${projectId}`);
    return res.data;
  }
};

// Opportunity Endpoints
export const opportunityService = {
  getOpportunities: async (params?: {
    search?: string;
    type?: string;
    mode?: string;
    branch?: string;
    skill?: string;
    sort_by?: string;
    min_score?: number;
  }) => {
    const res = await apiClient.get<Opportunity[]>('/opportunities', { params });
    return res.data;
  },
  getOpportunity: async (id: number) => {
    const res = await apiClient.get<Opportunity>(`/opportunities/${id}`);
    return res.data;
  },
  createOpportunity: async (data: Partial<Opportunity>) => {
    const res = await apiClient.post<Opportunity>('/opportunities', data);
    return res.data;
  },
  updateOpportunity: async (id: number, data: Partial<Opportunity>) => {
    const res = await apiClient.put<Opportunity>(`/opportunities/${id}`, data);
    return res.data;
  },
  deleteOpportunity: async (id: number) => {
    const res = await apiClient.delete(`/opportunities/${id}`);
    return res.data;
  }
};

// Recommendation Endpoints
export const recommendationService = {
  getRecommendations: async () => {
    const res = await apiClient.get<Recommendation[]>('/recommendations');
    return res.data;
  },
  generateRecommendations: async () => {
    const res = await apiClient.post<Recommendation[]>('/recommendations/generate');
    return res.data;
  },
  getSkillGap: async () => {
    const res = await apiClient.get<SkillGapData>('/recommendations/skill-gap');
    return res.data;
  }
};

// Saved Opportunities Endpoints
export const savedService = {
  getSaved: async () => {
    const res = await apiClient.get<SavedOpportunityItem[]>('/saved');
    return res.data;
  },
  saveOpportunity: async (opportunityId: number) => {
    const res = await apiClient.post<{ message: string; saved: boolean }>(`/saved/${opportunityId}`);
    return res.data;
  },
  removeSaved: async (opportunityId: number) => {
    const res = await apiClient.delete<{ message: string; saved: boolean }>(`/saved/${opportunityId}`);
    return res.data;
  }
};

// Applications Endpoints
export const applicationService = {
  getApplications: async () => {
    const res = await apiClient.get<ApplicationItem[]>('/applications');
    return res.data;
  },
  createOrUpdateApplication: async (data: { opportunity_id: number; status: string; notes?: string }) => {
    const res = await apiClient.post<ApplicationItem>('/applications', data);
    return res.data;
  },
  updateApplication: async (id: number, data: { status: string; notes?: string }) => {
    const res = await apiClient.put<ApplicationItem>(`/applications/${id}`, data);
    return res.data;
  },
  deleteApplication: async (id: number) => {
    const res = await apiClient.delete(`/applications/${id}`);
    return res.data;
  }
};

// Admin Endpoints
export const adminService = {
  getStats: async () => {
    const res = await apiClient.get<AdminStats>('/admin/stats');
    return res.data;
  },
  getStudents: async () => {
    const res = await apiClient.get<RegisteredStudent[]>('/admin/students');
    return res.data;
  },
  getAnalytics: async () => {
    const res = await apiClient.get<any>('/admin/analytics');
    return res.data;
  }
};
