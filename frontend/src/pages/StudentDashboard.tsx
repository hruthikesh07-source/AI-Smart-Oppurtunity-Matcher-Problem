import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recommendationService, opportunityService, savedService, applicationService } from '../services/api';
import { Recommendation, Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  Sparkles,
  Compass,
  Bookmark,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  onViewDetails: (opp: Opportunity) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onViewDetails }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [totalOppsCount, setTotalOppsCount] = useState<number>(0);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [appsCount, setAppsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [recs, allOpps, saved, apps] = await Promise.all([
        recommendationService.getRecommendations(),
        opportunityService.getOpportunities(),
        savedService.getSaved(),
        applicationService.getApplications(),
      ]);
      setRecommendations(recs);
      setTotalOppsCount(allOpps.length);
      setSavedCount(saved.length);
      setAppsCount(apps.length);
    } catch (err: any) {
      console.error('Error fetching student dashboard', err);
      setError('Could not load dashboard data. Please make sure your backend server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await recommendationService.generateRecommendations();
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      setRefreshing(false);
    }
  };

  const handleToggleSave = async (opp: Opportunity) => {
    try {
      if (opp.is_saved) {
        await savedService.removeSaved(opp.id);
      } else {
        await savedService.saveOpportunity(opp.id);
      }
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Active AI Recommendation Session
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base mt-2 leading-relaxed opacity-90">
            Our recommendation engine has analyzed your profile against active opportunities.
            Review your top ranked matches and skill gap suggestions below.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onNavigate('recommended')}
              className="px-5 py-2.5 bg-white text-indigo-900 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-50 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              View Top Recommendations
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white rounded-xl text-sm font-semibold border border-white/20 backdrop-blur-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Recalculate Matches
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Summary Cards (Section 13 requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Opportunities */}
        <div
          onClick={() => onNavigate('all-opportunities')}
          className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Opportunities</span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalOppsCount}</div>
          <p className="text-xs text-slate-500 mt-1">Internships, hackathons & more</p>
        </div>

        {/* Recommended For You */}
        <div
          onClick={() => onNavigate('recommended')}
          className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Recommended</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{recommendations.length}</div>
          <p className="text-xs text-slate-500 mt-1">Tailored for your profile</p>
        </div>

        {/* Saved Opportunities */}
        <div
          onClick={() => onNavigate('saved')}
          className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Bookmarks</span>
            <Bookmark className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{savedCount}</div>
          <p className="text-xs text-slate-500 mt-1">Opportunities to revisit</p>
        </div>

        {/* Applications */}
        <div
          onClick={() => onNavigate('applied')}
          className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">My Applications</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{appsCount}</div>
          <p className="text-xs text-slate-500 mt-1">Tracked in pipeline</p>
        </div>
      </div>

      {/* Skill Gap Teaser Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-white border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Boost Your Match Potential</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Explore your personalized Skill Gap Analysis to see which skills will unlock the highest number of opportunities.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('skill-gap')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-end sm:self-auto"
        >
          View Skill Gap Analysis
        </button>
      </div>

      {/* Main Section: Top Matches For You (Section 13 requirement) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Top Matches For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ranked from highest to lowest match score based on your profile
            </p>
          </div>

          <button
            onClick={() => onNavigate('recommended')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            See All ({recommendations.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
            <p className="text-sm">Calculating recommendations with AI matching engine...</p>
          </div>
        ) : recommendations.length === 0 ? (
          /* Empty state (Section 27 requirement) */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Complete your profile to get personalized opportunities
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Add your branch, academic year, and skill set to enable the recommendation engine.
            </p>
            <button
              onClick={() => onNavigate('profile')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Complete Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((rec) => (
              <OpportunityCard
                key={rec.opportunity_id}
                opportunity={rec.opportunity}
                onViewDetails={onViewDetails}
                onToggleSave={handleToggleSave}
                isSaved={rec.opportunity.is_saved}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
