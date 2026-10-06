import React, { useState, useEffect } from 'react';
import { savedService } from '../services/api';
import { SavedOpportunityItem, Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Bookmark, Compass, RefreshCw, AlertCircle } from 'lucide-react';

interface SavedOpportunitiesProps {
  onViewDetails: (opp: Opportunity) => void;
  onNavigate: (tab: string) => void;
}

export const SavedOpportunities: React.FC<SavedOpportunitiesProps> = ({
  onViewDetails,
  onNavigate
}) => {
  const [savedItems, setSavedItems] = useState<SavedOpportunityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSaved = async () => {
    try {
      const data = await savedService.getSaved();
      setSavedItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemoveSaved = async (opp: Opportunity) => {
    try {
      await savedService.removeSaved(opp.id);
      setSavedItems(savedItems.filter((item) => item.opportunity_id !== opp.id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600 fill-indigo-600/20" />
            Saved Opportunities
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Revisit bookmarked internships, hackathons, and certifications.
          </p>
        </div>

        <div className="text-xs sm:text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {savedItems.length} saved
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          <p className="text-sm">Loading saved opportunities...</p>
        </div>
      ) : savedItems.length === 0 ? (
        /* Empty State (Section 27 requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">
            You haven't saved any opportunities yet
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Bookmark opportunities as you browse recommendations so you can prepare applications and track deadlines.
          </p>
          <button
            onClick={() => onNavigate('all-opportunities')}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 mx-auto"
          >
            <Compass className="w-4 h-4" />
            Explore Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <OpportunityCard
              key={item.id}
              opportunity={item.opportunity}
              onViewDetails={onViewDetails}
              onToggleSave={handleRemoveSaved}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
