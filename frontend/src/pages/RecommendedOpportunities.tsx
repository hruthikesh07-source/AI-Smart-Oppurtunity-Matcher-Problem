import React, { useState, useEffect } from 'react';
import { recommendationService, savedService } from '../services/api';
import { Recommendation, Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  AlertCircle
} from 'lucide-react';

interface RecommendedOpportunitiesProps {
  onViewDetails: (opp: Opportunity) => void;
  onNavigate: (tab: string) => void;
}

export const RecommendedOpportunities: React.FC<RecommendedOpportunitiesProps> = ({
  onViewDetails,
  onNavigate
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0);

  const fetchRecs = async () => {
    try {
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleRecalculate = async () => {
    setRefreshing(true);
    try {
      await recommendationService.generateRecommendations();
      await fetchRecs();
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
      fetchRecs();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter recommendations client-side
  const filtered = recommendations.filter((r) => {
    if (minScore > 0 && r.match_score < minScore) return false;
    if (typeFilter !== 'All' && r.opportunity.type !== typeFilter) return false;
    if (modeFilter !== 'All' && r.opportunity.mode !== modeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Ranked Opportunity Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recommended For You
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Opportunities sorted by highest personalized match score. Includes required skill overlap, branch eligibility, and interest correlation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculate}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-2 transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Recalculating...' : 'Recalculate Matches'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          Filter Matches:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Min Score Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Min Match:</span>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value={0}>All Scores</option>
              <option value={70}>70%+ (Good Fit)</option>
              <option value={80}>80%+ (Strong Match)</option>
              <option value={90}>90%+ (Exceptional)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
              <option value="Certification">Certification</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Recommended Opportunities */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          <p className="text-sm">Calculating recommendations with AI matching engine...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">
            No opportunities matched your active filter
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your minimum match score or format filters to see more recommendations.
          </p>
          <button
            onClick={() => {
              setMinScore(0);
              setTypeFilter('All');
              setModeFilter('All');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rec) => (
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
    </div>
  );
};
