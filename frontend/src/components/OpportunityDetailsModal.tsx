import React, { useState } from 'react';
import { Opportunity } from '../types';
import { MatchBadge } from './MatchBadge';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bookmark,
  Share2,
  Send,
  Layers,
  ChevronDown
} from 'lucide-react';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onSave?: (opp: Opportunity) => void;
  onStatusChange?: (opportunityId: number, status: string, notes?: string) => void;
  isSaved?: boolean;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  onClose,
  onSave,
  onStatusChange,
  isSaved = false
}) => {
  if (!opportunity) return null;

  const [currentStatus, setCurrentStatus] = useState<string>(
    opportunity.application_status || 'Interested'
  );
  const [appNotes, setAppNotes] = useState<string>('');
  const [statusUpdatedMsg, setStatusUpdatedMsg] = useState<string | null>(null);

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(opportunity.id, newStatus, appNotes);
      setStatusUpdatedMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setStatusUpdatedMsg(null), 3000);
    }
  };

  // Compile full skills list with status
  const matchedSet = new Set((opportunity.matched_skills || []).map((s) => s.toLowerCase()));
  const allReqSkills = opportunity.required_skills || [];
  const allPrefSkills = opportunity.preferred_skills || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                {opportunity.type}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                {opportunity.mode}
              </span>
              {opportunity.is_demo && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  Demo Opportunity
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {opportunity.title}
            </h2>
            <p className="text-slate-600 font-medium flex items-center gap-1.5 mt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              {opportunity.organization}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* AI Match Overview Banner */}
          {opportunity.match_score !== undefined && opportunity.match_score > 0 && (
            <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white p-5 rounded-2xl border border-indigo-100/80 shadow-xs">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Personalized Recommendation</h3>
                    <p className="text-xs text-slate-500">Calculated by Multi-Criteria AI Matching Engine</p>
                  </div>
                </div>
                <MatchBadge score={opportunity.match_score} size="lg" />
              </div>

              {/* Score Breakdown Progress Bars */}
              {opportunity.score_breakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-indigo-100/60 text-center">
                  <div className="bg-white/80 p-2 rounded-xl border border-indigo-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Skills (40%)</span>
                    <span className="text-sm font-bold text-indigo-700">{opportunity.score_breakdown.skill_score}%</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-indigo-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Interest (25%)</span>
                    <span className="text-sm font-bold text-indigo-700">{opportunity.score_breakdown.interest_score}%</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-indigo-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Branch (15%)</span>
                    <span className="text-sm font-bold text-indigo-700">{opportunity.score_breakdown.branch_score}%</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-indigo-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience (10%)</span>
                    <span className="text-sm font-bold text-indigo-700">{opportunity.score_breakdown.experience_score}%</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-indigo-50 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligibility (10%)</span>
                    <span className="text-sm font-bold text-indigo-700">{opportunity.score_breakdown.eligibility_score}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Why This Matches You (Section 16 requirement) */}
          {opportunity.explanation && opportunity.explanation.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Why This Matches You
              </h4>
              <ul className="space-y-1.5">
                {opportunity.explanation.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-emerald-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">About this Opportunity</h4>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Your Skill Match Checklist (Section 16 requirement) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>Your Skill Compatibility</span>
              <span className="text-xs font-normal text-slate-500">
                {matchedSet.size} matched / {allReqSkills.length + allPrefSkills.length} total
              </span>
            </h4>

            {allReqSkills.length > 0 && (
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Required Skills:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allReqSkills.map((skill, idx) => {
                    const isMatched = matchedSet.has(skill.toLowerCase());
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold ${
                          isMatched
                            ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50/70 text-rose-800 border-rose-200'
                        }`}
                      >
                        <span>{skill}</span>
                        {isMatched ? (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 fill-emerald-100" /> Matched
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600">
                            <XCircle className="w-4 h-4 fill-rose-100" /> Missing
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {allPrefSkills.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Preferred / Bonus Skills:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPrefSkills.map((skill, idx) => {
                    const isMatched = matchedSet.has(skill.toLowerCase());
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold ${
                          isMatched
                            ? 'bg-indigo-50/80 text-indigo-800 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span>{skill}</span>
                        {isMatched ? (
                          <span className="flex items-center gap-1 text-indigo-700">
                            <CheckCircle2 className="w-4 h-4 fill-indigo-100" /> Bonus Match
                          </span>
                        ) : (
                          <span className="text-slate-400">Optional</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Eligible Branches</span>
              <span className="text-xs font-semibold text-slate-800">
                {opportunity.eligible_branches?.join(', ') || 'All'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Eligible Year</span>
              <span className="text-xs font-semibold text-slate-800">
                Year {opportunity.minimum_year} - {opportunity.maximum_year}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Experience</span>
              <span className="text-xs font-semibold text-slate-800">
                {opportunity.experience_required}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Location</span>
              <span className="text-xs font-semibold text-slate-800">
                {opportunity.location}
              </span>
            </div>
          </div>

          {/* Application Tracker Interactive Bar (Section 19 requirement) */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Application Pipeline Tracker
              </h4>
              {statusUpdatedMsg && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md animate-fade-in">
                  ✓ {statusUpdatedMsg}
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {['Interested', 'Applied', 'Shortlisted', 'Selected', 'Rejected'].map((statusOption) => {
                const isActive = currentStatus === statusOption;
                return (
                  <button
                    key={statusOption}
                    onClick={() => handleStatusUpdate(statusOption)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? statusOption === 'Selected'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : statusOption === 'Rejected'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {statusOption}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Add personal notes (e.g., submitted referral, interview on Monday)..."
              value={appNotes}
              onChange={(e) => setAppNotes(e.target.value)}
              onBlur={() => onStatusChange && onStatusChange(opportunity.id, currentStatus, appNotes)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onSave && (
              <button
                onClick={() => onSave(opportunity)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isSaved
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <a
              href={opportunity.apply_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleStatusUpdate('Applied')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
