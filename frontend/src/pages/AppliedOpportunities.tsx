import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import { ApplicationItem, Opportunity } from '../types';
import { MatchBadge } from '../components/MatchBadge';
import {
  Briefcase,
  Calendar,
  Building2,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react';

interface AppliedOpportunitiesProps {
  onViewDetails: (opp: Opportunity) => void;
  onNavigate: (tab: string) => void;
}

const STAGES = ['Interested', 'Applied', 'Shortlisted', 'Selected', 'Rejected'] as const;

export const AppliedOpportunities: React.FC<AppliedOpportunitiesProps> = ({
  onViewDetails,
  onNavigate
}) => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const fetchApps = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleUpdateStatus = async (appId: number, newStatus: string) => {
    try {
      await applicationService.updateApplication(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus as any } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async (appId: number, currentStatus: string) => {
    try {
      await applicationService.updateApplication(appId, { status: currentStatus, notes: editNotes });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, notes: editNotes } : a))
      );
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteApp = async (appId: number) => {
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (e) {
      console.error(e);
    }
  };

  // Group applications by status for Kanban pipeline view
  const groupedApps: Record<string, ApplicationItem[]> = {
    Interested: [],
    Applied: [],
    Shortlisted: [],
    Selected: [],
    Rejected: [],
  };

  applications.forEach((app) => {
    if (groupedApps[app.status]) {
      groupedApps[app.status].push(app);
    } else {
      groupedApps['Applied'].push(app);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Application Pipeline Tracker
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track and manage your application progress: Interested → Applied → Shortlisted → Selected.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm text-slate-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl">
            {applications.length} Total Applications
          </div>
          <button
            onClick={() => onNavigate('all-opportunities')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Find More
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          <p className="text-sm">Loading your application pipeline...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">
            No applications tracked yet
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            When you view opportunity details, click "Apply Now" or select a status to track your progress in this Kanban board.
          </p>
          <button
            onClick={() => onNavigate('recommended')}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all mx-auto"
          >
            Explore Recommended Matches
          </button>
        </div>
      ) : (
        /* Kanban Board Pipeline (Section 19 requirement) */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {STAGES.map((stage) => {
            const items = groupedApps[stage] || [];
            const headerColor = {
              Interested: 'bg-slate-100 text-slate-700 border-slate-200',
              Applied: 'bg-blue-50 text-blue-700 border-blue-200',
              Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200',
              Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
            }[stage];

            return (
              <div
                key={stage}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3.5 space-y-3 min-h-[300px]"
              >
                {/* Stage Header */}
                <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between ${headerColor}`}>
                  <span>{stage}</span>
                  <span className="w-5 h-5 rounded-full bg-white/80 text-center leading-5 text-[11px]">
                    {items.length}
                  </span>
                </div>

                {/* Stage Items */}
                <div className="space-y-3">
                  {items.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                          {app.opportunity.type}
                        </span>
                        {app.opportunity.match_score && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            {Math.round(app.opportunity.match_score)}% Match
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => onViewDetails(app.opportunity)}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                      >
                        {app.opportunity.title}
                      </h4>
                      <p className="text-slate-500 font-medium text-[11px] line-clamp-1">
                        {app.opportunity.organization}
                      </p>

                      {/* Move to another status */}
                      <div className="pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                          Move to:
                        </label>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Notes Section */}
                      {editingId === app.id ? (
                        <div className="space-y-1 pt-1">
                          <textarea
                            rows={2}
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add interview notes, referrals, etc..."
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                          />
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-0.5 text-[10px] text-slate-500"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(app.id, app.status)}
                              className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <button
                            onClick={() => {
                              setEditingId(app.id);
                              setEditNotes(app.notes || '');
                            }}
                            className="text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {app.notes ? 'Edit Notes' : '+ Notes'}
                          </button>
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="text-slate-400 hover:text-rose-600"
                            title="Delete tracker card"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {app.notes && editingId !== app.id && (
                        <p className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 italic border border-slate-100">
                          "{app.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
