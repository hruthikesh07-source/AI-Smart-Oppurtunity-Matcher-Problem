import React from 'react';
import { Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

interface MatchBadgeProps {
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ score = 0, size = 'md', showLabel = true }) => {
  if (score === undefined || score === null || score === 0) {
    return null;
  }

  const rounded = Math.round(score);

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = 'Growth Match';
  let Icon = TrendingUp;

  if (rounded >= 90) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20';
    label = 'Exceptional Match';
    Icon = Sparkles;
  } else if (rounded >= 80) {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-500/20';
    label = 'Strong Match';
    Icon = CheckCircle2;
  } else if (rounded >= 70) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-300';
    label = 'Good Match';
    Icon = TrendingUp;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <div className={`inline-flex items-center rounded-full border shadow-xs transition-all ${colorClasses} ${sizeClasses}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{rounded}% MATCH</span>
      {showLabel && size !== 'sm' && (
        <span className="hidden sm:inline font-normal opacity-75">· {label}</span>
      )}
    </div>
  );
};
