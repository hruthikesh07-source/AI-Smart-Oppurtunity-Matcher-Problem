import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, recommendationService } from '../services/api';
import { StudentProfile as IStudentProfile, Project } from '../types';
import {
  User,
  GraduationCap,
  Code2,
  Sparkles,
  Plus,
  X,
  Briefcase,
  Layers,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python', 'Java', 'C', 'C++', 'JavaScript', 'React', 'HTML', 'CSS',
  'SQL', 'Machine Learning', 'Data Science', 'Cloud Computing',
  'Cybersecurity', 'Git', 'Django', 'FastAPI', 'Docker', 'Kubernetes',
  'TensorFlow', 'Deep Learning', 'PyTorch', 'Flutter', 'Node.js',
  'AWS', 'Data Analytics', 'UI/UX Design', 'IoT', 'Blockchain'
];

const COMMON_INTERESTS = [
  'Artificial Intelligence',
  'Web Development',
  'App Development',
  'Cybersecurity',
  'Data Science',
  'Cloud Computing',
  'IoT',
  'Blockchain'
];

const PREFERRED_TYPES = [
  'Internship',
  'Hackathon',
  'Workshop',
  'Competition',
  'Certification'
];

const BRANCHES = [
  'CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'
];

interface StudentProfilePageProps {
  onNavigate: (tab: string) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<IStudentProfile | null>(null);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState<number>(3);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [workExperience, setWorkExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [careerPreferences, setCareerPreferences] = useState<string[]>([]);

  // Project Add state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
        setName(data.name || user?.name || '');
        setCollege(data.college || '');
        setBranch(data.branch || 'CSE');
        setYear(data.year || 3);
        setExperienceLevel(data.experience_level || 'Intermediate');
        setWorkExperience(data.work_experience || '');
        setSkills(data.skills || []);
        setInterests(data.interests || []);
        setCareerPreferences(data.career_preferences || []);
        setProjects(data.projects || []);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSkill.trim();
    if (clean && !skills.map((s) => s.toLowerCase()).includes(clean.toLowerCase())) {
      setSkills([...skills, clean]);
      setCustomSkill('');
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleTogglePref = (pref: string) => {
    if (careerPreferences.includes(pref)) {
      setCareerPreferences(careerPreferences.filter((p) => p !== pref));
    } else {
      setCareerPreferences([...careerPreferences, pref]);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) return;

    try {
      const newProj = await profileService.addProject({
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        technologies: projectTech.trim()
      });
      setProjects([...projects, newProj]);
      setProjectTitle('');
      setProjectDesc('');
      setProjectTech('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId?: number) => {
    if (!projectId) return;
    try {
      await profileService.deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await profileService.updateProfile({
        name,
        college,
        branch,
        year,
        experience_level: experienceLevel,
        work_experience: workExperience,
        skills,
        interests,
        career_preferences: careerPreferences
      });
      await refreshUser();
      // Recalculate recommendations in the background
      await recommendationService.generateRecommendations();
      setSuccessMsg('Profile successfully updated! Recommendations have been updated.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg('Failed to update profile. Please verify all inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
        <p className="text-sm">Loading your profile configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            Student Profile Setup
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Keep your skills, experience, and projects updated for higher accuracy recommendations.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* 1. Basic Information (Section 7) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Basic Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College / University
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Branch / Discipline
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={1}>1st Year (Freshman)</option>
                <option value={2}>2nd Year (Sophomore)</option>
                <option value={3}>3rd Year (Junior)</option>
                <option value={4}>4th Year (Senior)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Skills Multi-selector (Section 7) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              Technical Skills ({skills.length} selected)
            </h2>
            <span className="text-xs text-slate-500">Affects 40% of matching score</span>
          </div>

          {/* Selected Skills Chips */}
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[50px] items-center">
            {skills.length === 0 ? (
              <span className="text-xs text-slate-400">Click below or add custom skills...</span>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className="hover:opacity-75"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add other skill (e.g. Next.js, PyTorch)..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Add Skill
            </button>
          </div>

          {/* Quick Click Common Skills */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Suggested Popular Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Interests & Career Preferences (Section 7) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Areas of Interest ({interests.length} selected)
            </h2>
            <p className="text-xs text-slate-500 mb-3">Affects 25% of your matching recommendation score</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-1">Preferred Opportunity Formats</h2>
            <p className="text-xs text-slate-500 mb-3">Select what types of opportunities you are seeking</p>
            <div className="flex flex-wrap gap-2">
              {PREFERRED_TYPES.map((type) => {
                const isSelected = careerPreferences.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTogglePref(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Experience & Work History (Section 7) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Experience Level & Work History
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Self-Assessed Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    experienceLevel === lvl
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Previous Internships or Work Experience (Optional)
            </label>
            <textarea
              rows={3}
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              placeholder="e.g. Completed a 2-month summer internship working with Python scripting and database maintenance..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 5. Projects Portfolio Manager (Section 7) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Project Portfolio ({projects.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Projects boost your NLP text similarity score and demonstrate real-world implementation capability.
            </p>
          </div>

          {/* Existing Projects List */}
          {projects.length > 0 && (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{proj.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                    {proj.technologies && (
                      <span className="inline-block mt-2 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {proj.technologies}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Project Form */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-600" /> Add New Project
            </span>
            <input
              type="text"
              placeholder="Project Title (e.g. AI Smart Healthcare Diagnostic Assistant)"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <textarea
              rows={2}
              placeholder="Project Description (What problem did it solve? Key methods used?)"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Technologies Used (e.g. Python, Scikit-learn, React)"
                value={projectTech}
                onChange={(e) => setProjectTech(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddProject}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save Profile & Recalculate Matches'}
          </button>
        </div>
      </form>
    </div>
  );
};
