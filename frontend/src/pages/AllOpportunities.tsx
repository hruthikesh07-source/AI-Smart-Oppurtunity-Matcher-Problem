import React, { useState, useEffect } from 'react';
import { opportunityService, savedService } from '../services/api';
import { Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  Search,
  SlidersHorizontal,
  Compass,
  RefreshCw,
  X,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface AllOpportunitiesProps {
  onViewDetails: (opp: Opportunity) => void;
}

const COMMON_SKILLS = [
  'Python', 'React', 'SQL', 'Machine Learning', 'Git', 'JavaScript',
  'Java', 'C++', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'IoT'
];

export const AllOpportunities: React.FC<AllOpportunitiesProps> = ({ onViewDetails }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('best_match');

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const data = await opportunityService.getOpportunities({
        search: search.trim() || undefined,
        type: typeFilter !== 'All' ? typeFilter : undefined,
        mode: modeFilter !== 'All' ? modeFilter : undefined,
        branch: branchFilter !== 'All' ? branchFilter : undefined,
        skill: skillFilter !== 'All' ? skillFilter : undefined,
        sort_by: sortBy,
      });
      setOpportunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpps();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, typeFilter, modeFilter, branchFilter, skillFilter, sortBy]);

  const handleToggleSave = async (opp: Opportunity) => {
    try {
      if (opp.is_saved) {
        await savedService.removeSaved(opp.id);
      } else {
        await savedService.saveOpportunity(opp.id);
      }
      fetchOpps();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setModeFilter('All');
    setBranchFilter('All');
    setSkillFilter('All');
    setSortBy('best_match');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            Explore All Opportunities
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Search and filter through internships, hackathons, workshops, competitions, and verified demo records.
          </p>
        </div>

        <div className="text-xs sm:text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Showing {opportunities.length} opportunities
        </div>
      </div>

      {/* Search and Filters Hub */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by opportunity title, company, skill (e.g. Python, Machine Learning), or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Opportunity Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Format Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Formats</option>
              <option value="Internship">Internship</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
              <option value="Certification">Certification</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Mode
            </label>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Eligible Branch
            </label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="AIML">AIML</option>
              <option value="Data Science">Data Science</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Required Skill
            </label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Skills</option>
              {COMMON_SKILLS.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-indigo-700 focus:outline-none"
            >
              <option value="best_match">Best Match Score</option>
              <option value="deadline">Deadline Soonest</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Helper */}
        {(search || typeFilter !== 'All' || modeFilter !== 'All' || branchFilter !== 'All' || skillFilter !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filters active</span>
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          <p className="text-sm">Fetching matching opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">
            No opportunities found
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Try adjusting your search query or reset your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onViewDetails={onViewDetails}
              onToggleSave={handleToggleSave}
              isSaved={opp.is_saved}
            />
          ))}
        </div>
      )}
    </div>
  );
};
