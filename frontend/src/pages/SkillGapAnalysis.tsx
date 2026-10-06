import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/api';
import { SkillGapData } from '../types';
import {
  Layers,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Compass
} from 'lucide-react';

interface SkillGapAnalysisProps {
  onNavigate: (tab: string) => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ onNavigate }) => {
  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSkillGap = async () => {
    try {
      const res = await recommendationService.getSkillGap();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
        <p className="text-sm">Analyzing current market skill demand against your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Career Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" />
            Your Skill Gap Analysis
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Compare your verified skill set against the requirements of recommended opportunities.
          </p>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          Update My Skills
        </button>
      </div>

      {/* Top AI Insight Banner (Section 17 requirement) */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4 text-purple-300" />
            High-Impact Career Growth Recommendation
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            {data?.top_recommendation || 'Your profile is currently well-aligned with your target opportunities.'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-2 leading-relaxed opacity-90">
            Targeting these missing technologies will improve your overall eligibility across active internships, hackathons, and certifications.
          </p>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Two Column Layout: Skills You Have vs Skills To Improve (Section 17) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Skills You Have */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Skills You Have ({data?.skills_have.length || 0})
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Verified on Profile
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These skills currently grant you strong compatibility in matching algorithms:
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {data?.skills_have && data.skills_have.length > 0 ? (
              data.skills_have.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {skill}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No skills listed yet in your profile.</p>
            )}
          </div>
        </div>

        {/* Right Column: Skills To Improve */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              In-Demand Skills to Improve
            </h3>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              Ranked by Demand
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Skills frequently demanded by your top recommended opportunities:
          </p>

          <div className="space-y-3 pt-2">
            {data?.skills_to_improve && data.skills_to_improve.length > 0 ? (
              data.skills_to_improve.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-purple-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      {item.skill}
                    </span>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      Required in {item.demand_count} {item.demand_count === 1 ? 'Opportunity' : 'Opportunities'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {item.impact_statement}
                  </p>
                  {item.related_opportunities.length > 0 && (
                    <p className="text-[11px] text-slate-500 pt-1">
                      Targeted by: <span className="font-medium text-slate-700">{item.related_opportunities.join(', ')}</span>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No significant skill gap detected! You qualify for all top opportunities.</p>
            )}
          </div>
        </div>
      </div>

      {/* Learning Pathway Suggestions */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Recommended Learning Actions
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Based on aggregate requirements across engineering branches, prioritizing foundational machine learning frameworks (e.g. TensorFlow/PyTorch)
          or cloud architecture certifications will maximize your competitive edge.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-900 mb-1">1. Hands-on Mini Projects</h4>
            <p className="text-[11px] text-slate-500">
              Build a GitHub repository demonstrating end-to-end integration of one missing skill.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-900 mb-1">2. Attend Targeted Workshops</h4>
            <p className="text-[11px] text-slate-500">
              Check the Workshops tab for practical, weekend deep dives on trending stacks.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-900 mb-1">3. Track Your Growth</h4>
            <p className="text-[11px] text-slate-500">
              Once learned, add it to your profile to immediately observe your match score improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
