import React from 'react';
import { Opportunity } from '../types';
import { MatchBadge } from './MatchBadge';
import {
  Calendar,
  MapPin,
  Globe,
  Bookmark,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (opp: Opportunity) => void;
  onToggleSave?: (opp: Opportunity) => void;
  isSaved?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  onToggleSave,
  isSaved
}) => {
  const isBookmarked = isSaved ?? opportunity.is_saved ?? false;

  // Format deadline and compute remaining days
  const formatDeadline = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffTime = d.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        daysRemaining: diffDays,
      };
    } catch {
      return { formatted: dateStr, daysRemaining: null };
    }
  };

  const deadlineInfo = formatDeadline(opportunity.deadline);

  // Type color badge
  const typeBadgeColors: Record<string, string> = {
    Internship: 'bg-blue-50 text-blue-700 border-blue-200',
    Hackathon: 'bg-purple-50 text-purple-700 border-purple-200',
    Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Competition: 'bg-amber-50 text-amber-700 border-amber-200',
    Certification: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const typeClass = typeBadgeColors[opportunity.type] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Header Banner */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${typeClass}`}>
              {opportunity.type}
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
              <Globe className="w-3 h-3 text-slate-500" />
              {opportunity.mode}
            </span>
            {opportunity.is_demo && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                Demo
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(opportunity);
              }}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Title & Organization */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mt-1"
        >
          {opportunity.title}
        </h3>
        <p className="text-sm font-medium text-slate-600 line-clamp-1 mb-3">
          {opportunity.organization}
        </p>

        {/* Match Badge */}
        {opportunity.match_score !== undefined && opportunity.match_score > 0 && (
          <div className="mb-3">
            <MatchBadge score={opportunity.match_score} size="md" />
          </div>
        )}

        {/* Matching Skills Checkmarks */}
        {opportunity.matched_skills && opportunity.matched_skills.length > 0 ? (
          <div className="space-y-1 mb-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
              <Check className="w-3 h-3 text-emerald-600" /> Matching Profile Attributes:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.matched_skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <Check className="w-3 h-3 stroke-[2.5]" /> {skill}
                </span>
              ))}
              {opportunity.matched_skills.length > 3 && (
                <span className="text-xs text-slate-500 font-medium self-center">
                  +{opportunity.matched_skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {opportunity.description}
            </p>
          </div>
        )}

        {/* AI Explanation Snippet */}
        {opportunity.explanation && opportunity.explanation.length > 0 && (
          <div className="text-xs text-indigo-900 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 flex items-start gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-snug">
              {opportunity.explanation[0]}
            </p>
          </div>
        )}

        {/* Application Status Badge if exists */}
        {opportunity.application_status && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200 w-fit">
            <Briefcase className="w-3.5 h-3.5" />
            Status: {opportunity.application_status}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {deadlineInfo.formatted}
            {deadlineInfo.daysRemaining !== null && deadlineInfo.daysRemaining > 0 && (
              <span className={`ml-1 font-semibold ${deadlineInfo.daysRemaining <= 7 ? 'text-rose-600' : 'text-slate-600'}`}>
                ({deadlineInfo.daysRemaining}d left)
              </span>
            )}
          </span>
        </div>

        <button
          onClick={() => onViewDetails(opportunity)}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-0.5"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
