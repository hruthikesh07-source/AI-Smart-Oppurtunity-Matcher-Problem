import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Target,
  BarChart,
  Search,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Layers
} from 'lucide-react';
import { Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onViewDetails: (opp: Opportunity) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onViewDetails }) => {
  // Demo opportunities for the landing showcase
  const sampleLandingOpps: Opportunity[] = [
    {
      id: 1,
      title: 'AI Innovation Hackathon 2026',
      organization: 'National AI Research Center & TechCorp',
      type: 'Hackathon',
      description: 'Build next-generation generative AI and computer vision solutions tackling sustainable development goals.',
      required_skills: ['Python', 'Machine Learning'],
      preferred_skills: ['TensorFlow', 'Deep Learning'],
      eligible_branches: ['CSE', 'IT', 'AIML'],
      minimum_year: 2,
      maximum_year: 4,
      experience_required: 'Intermediate',
      location: 'Bengaluru (Hybrid)',
      mode: 'Hybrid',
      deadline: '2026-11-20',
      apply_url: 'https://example.com/apply/ai-hackathon',
      is_demo: true,
      match_score: 94.0,
      matched_skills: ['Python', 'Machine Learning'],
      explanation: ['You have Python and Machine Learning skills required by this hackathon.']
    },
    {
      id: 2,
      title: 'Python Developer Internship',
      organization: 'Cognitive Cloud Solutions',
      type: 'Internship',
      description: 'Join our backend platform engineering squad developing scalable microservices and database caching architectures.',
      required_skills: ['Python', 'SQL', 'Git'],
      preferred_skills: ['Django', 'FastAPI'],
      eligible_branches: ['CSE', 'IT', 'ECE'],
      minimum_year: 2,
      maximum_year: 4,
      experience_required: 'Intermediate',
      location: 'Hyderabad (Remote)',
      mode: 'Online',
      deadline: '2026-10-30',
      apply_url: 'https://example.com/apply/python-internship',
      is_demo: true,
      match_score: 89.0,
      matched_skills: ['Python', 'SQL', 'Git'],
      explanation: ['Matches your core backend tech stack and Intermediate experience level.']
    },
    {
      id: 3,
      title: 'National Data Science Competition',
      organization: 'Analytics India Consortium',
      type: 'Competition',
      description: 'Predictive analytics championship analyzing multimodal healthcare and economic trends. Cash prizes and fast-tracks.',
      required_skills: ['Python', 'Data Science', 'SQL'],
      preferred_skills: ['Machine Learning'],
      eligible_branches: ['All'],
      minimum_year: 2,
      maximum_year: 4,
      experience_required: 'Intermediate',
      location: 'National Online Platform',
      mode: 'Online',
      deadline: '2026-11-15',
      apply_url: 'https://example.com/apply/data-science-cup',
      is_demo: true,
      match_score: 86.5,
      matched_skills: ['Python', 'SQL'],
      explanation: ['Aligns with your AI & Data Science interests and 3rd year eligibility.']
    }
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-16 lg:pb-20">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-subtle-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI Opportunity Matching Engine
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Find Opportunities <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Made for You
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            AI-powered recommendations for internships, hackathons, workshops, competitions, and certifications
            tailored to your exact skills, branch, and experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('all-opportunities')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              Explore Opportunities
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-200/70 text-slate-700">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">100%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Transparent Match Scores</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">5-Way</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Weighted AI Evaluation</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">TF-IDF</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">NLP Semantic Similarity</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">0% Fake</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Clearly Verified Demo Data</div>
            </div>
          </div>
        </div>

        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/40 to-pink-200/20 blur-3xl -z-10 pointer-events-none rounded-full" />
      </section>

      {/* Interactive Architecture Flow Diagram (Section 5 requirement) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block mb-2">
              System Architecture & Data Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Student Profile → AI Matching → Personalized Opportunities
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              How student data turns into ranked, explainable career opportunities in real-time.
            </p>
          </div>

          {/* Diagram Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Student Profile</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Collects branch, year, skills, interests, project portfolio, and preferred opportunity categories.
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Skills: Python, SQL, React</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Branch: CSE · 3rd Year</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Interests: AI, Web Dev</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-indigo-900/40 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/40 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-2">AI Matching Engine</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Computes TF-IDF vectorization and 5-criteria weighted similarity ranking.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-indigo-200 bg-slate-900/70 p-3 rounded-xl border border-indigo-500/30">
                <div>• Skill Match: 40%</div>
                <div>• Interest Match: 25%</div>
                <div>• Branch Match: 15%</div>
                <div>• Experience Match: 10%</div>
                <div>• Eligibility Match: 10%</div>
                <div className="pt-1 text-[10px] text-purple-300 border-t border-slate-700 mt-1">
                  + TF-IDF Cosine Similarity
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Ranked Opportunities</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Delivers ranked recommendations with clear reasoning, missing skills, and 1-click tracking.
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">AI Hackathon</span>
                  <span className="text-emerald-400 font-bold">94% Match</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Python Internship</span>
                  <span className="text-indigo-400 font-bold">89% Match</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  ✓ Shows missing skills & recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards (Section 5 requirements) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 block mb-2">
            Why Students Choose Us
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Propel Your Tech Career
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Built specifically to solve the opportunity discovery gap for undergraduate engineering students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">AI-Powered Matching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Combines scikit-learn TF-IDF text vectorization with weighted multi-criteria scoring to identify the best opportunities for your unique profile.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Personalized Recommendations</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Transparent, ranked results. Every single recommendation explains exactly why it was suggested and lists skills you have versus skills you may need.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Skill Gap Analysis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pinpoints exact high-demand skills missing from your profile. Tells you which libraries or technologies to learn next to unlock more opportunities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Opportunity Search</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Multi-facet filtering across internships, hackathons, workshops, and certifications by branch eligibility, required mode, and deadline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-rose-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Deadline Tracking</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Visual countdown alerts so you never miss an application deadline again. Save bookmarks and organize your application workflow.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Application Pipeline</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track your journey from Interested to Applied, Shortlisted, and Selected with personal notes and interview preparation logs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 block mb-1">
              Live Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Sample Recommended Opportunities
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Curated demo records demonstrating personalized match scoring and skill breakdowns.
            </p>
          </div>

          <button
            onClick={() => onNavigate('all-opportunities')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto"
          >
            Browse All 15+ Opportunities
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleLandingOpps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* Evaluation Demo Account Callout Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md">
              Instant Demonstration Mode
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2 mb-1">
              Ready to evaluate the recommendation engine?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Sign in with pre-configured student or admin demo credentials to immediately explore personalized matches, skill gaps, and admin analytics without filling forms.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              Sign In to Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
