import React, { useState, useEffect } from 'react';
import { opportunityService } from '../services/api';
import { Opportunity } from '../types';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Globe
} from 'lucide-react';

interface ManageOpportunitiesProps {
  onViewDetails: (opp: Opportunity) => void;
}

export const ManageOpportunities: React.FC<ManageOpportunitiesProps> = ({ onViewDetails }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [type, setType] = useState('Internship');
  const [mode, setMode] = useState('Online');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [eligibleBranches, setEligibleBranches] = useState('CSE, IT, AIML, Data Science');
  const [minYear, setMinYear] = useState<number>(1);
  const [maxYear, setMaxYear] = useState<number>(4);
  const [experienceRequired, setExperienceRequired] = useState('Beginner');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [applyUrl, setApplyUrl] = useState('https://example.com/apply');
  const [isDemo, setIsDemo] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchOpps = async () => {
    try {
      const data = await opportunityService.getOpportunities({
        search: search.trim() || undefined,
        type: typeFilter !== 'All' ? typeFilter : undefined,
      });
      setOpportunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchOpps(), 200);
    return () => clearTimeout(t);
  }, [search, typeFilter]);

  const handleOpenAdd = () => {
    setEditingOpp(null);
    setTitle('');
    setOrganization('');
    setType('Internship');
    setMode('Online');
    setLocation('Remote');
    setDescription('');
    setRequiredSkills('');
    setPreferredSkills('');
    setEligibleBranches('CSE, IT, AIML, Data Science');
    setMinYear(1);
    setMaxYear(4);
    setExperienceRequired('Beginner');
    setDeadline('2026-12-31');
    setApplyUrl('https://example.com/apply');
    setIsDemo(true);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setOrganization(opp.organization);
    setType(opp.type);
    setMode(opp.mode);
    setLocation(opp.location);
    setDescription(opp.description);
    setRequiredSkills(opp.required_skills?.join(', ') || '');
    setPreferredSkills(opp.preferred_skills?.join(', ') || '');
    setEligibleBranches(opp.eligible_branches?.join(', ') || 'All');
    setMinYear(opp.minimum_year);
    setMaxYear(opp.maximum_year);
    setExperienceRequired(opp.experience_required);
    setDeadline(opp.deadline);
    setApplyUrl(opp.apply_url);
    setIsDemo(opp.is_demo);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this opportunity?')) {
      return;
    }
    try {
      await opportunityService.deleteOpportunity(id);
      setOpportunities(opportunities.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete opportunity.');
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim() || !description.trim() || !deadline.trim()) {
      setFormError('Please fill in Title, Organization, Description, and Deadline.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      title: title.trim(),
      organization: organization.trim(),
      type: type as any,
      mode: mode as any,
      location: location.trim(),
      description: description.trim(),
      required_skills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferred_skills: preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      eligible_branches: eligibleBranches.split(',').map((s) => s.trim()).filter(Boolean),
      minimum_year: Number(minYear),
      maximum_year: Number(maxYear),
      experience_required: experienceRequired.trim(),
      deadline: deadline.trim(),
      apply_url: applyUrl.trim(),
      is_demo: isDemo,
    };

    try {
      if (editingOpp) {
        await opportunityService.updateOpportunity(editingOpp.id, payload);
      } else {
        await opportunityService.createOpportunity(payload);
      }
      setModalOpen(false);
      fetchOpps();
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to save opportunity. Please verify input data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Manage Opportunity Catalog
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Add, update, or remove internships, hackathons, workshops, competitions, and verified demo opportunities.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Opportunity
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
            <option value="Certification">Certification</option>
          </select>
        </div>
      </div>

      {/* Opportunities Management Table */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          <p className="text-sm">Loading catalog records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Title & Organization</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Mode / Location</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Required Skills</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onViewDetails(opp)}
                        className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1"
                      >
                        {opp.title}
                      </div>
                      <div className="text-slate-500 text-[11px] line-clamp-1">{opp.organization}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {opp.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{opp.mode}</div>
                      <div className="text-slate-400 text-[11px]">{opp.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">{opp.deadline}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {opp.required_skills?.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                        {(opp.required_skills?.length || 0) > 3 && (
                          <span className="text-[10px] text-slate-400">+{opp.required_skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(opp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit Opportunity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(opp.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Opportunity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal (Section 21 requirement) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingOpp ? 'Edit Opportunity' : 'Add New Opportunity'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI Innovation Hackathon 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Cognitive Labs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of opportunity responsibilities and eligibility..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="Python, SQL, Git"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Skills (comma separated)</label>
                  <input
                    type="text"
                    value={preferredSkills}
                    onChange={(e) => setPreferredSkills(e.target.value)}
                    placeholder="FastAPI, Docker, React"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligible Branches</label>
                  <input
                    type="text"
                    value={eligibleBranches}
                    onChange={(e) => setEligibleBranches(e.target.value)}
                    placeholder="CSE, IT, All"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min - Max Year</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={minYear}
                      onChange={(e) => setMinYear(Number(e.target.value))}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center"
                    />
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={maxYear}
                      onChange={(e) => setMaxYear(Number(e.target.value))}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience Level</label>
                  <select
                    value={experienceRequired}
                    onChange={(e) => setExperienceRequired(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apply URL</label>
                  <input
                    type="url"
                    value={applyUrl}
                    onChange={(e) => setApplyUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {saving ? 'Saving...' : editingOpp ? 'Save Changes' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
