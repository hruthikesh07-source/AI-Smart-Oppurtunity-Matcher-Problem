import React from 'react';
import {
  Sparkles,
  Cpu,
  Database,
  Shield,
  Layers,
  CheckCircle2,
  Code2,
  Brain,
  Sliders,
  Scale
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
          <Brain className="w-3.5 h-3.5" />
          Technical Architecture & Methodology
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          How the AI Matching Engine Works
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          The AI Smart Opportunity Matcher combines rule-based domain logic with natural language processing (NLP)
          to calculate personalized, explainable relevance scores for engineering students.
        </p>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
          <h2 className="text-lg font-bold text-rose-950 mb-3 flex items-center gap-2">
            The Problem
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">
            Students frequently miss out on high-impact internships, hackathons, and certifications because opportunities are scattered across hundreds of platforms.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              Students apply blindly without knowing if their branch or year is eligible.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              Opportunities demand specific skill stacks that students don't realize they are missing.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              Lack of clear explanation why an opportunity is or isn't a good fit.
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
          <h2 className="text-lg font-bold text-emerald-950 mb-3 flex items-center gap-2">
            The Solution
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">
            Our hybrid matching engine analyzes the student's profile across 5 distinct dimensions and pairs it with semantic text matching for transparent career recommendations.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Calculates a personalized 0-100% match score for every opportunity.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Ranks opportunities so the most relevant matches appear at the top.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Provides actionable skill gap analysis showing exactly what technologies to learn next.
            </li>
          </ul>
        </div>
      </div>

      {/* 5-Criteria Weighted Scoring Breakdown (Section 10 requirements) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          Mathematical Formula
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          5-Criteria Weighted Scoring Formula
        </h2>
        <div className="bg-slate-900 text-indigo-300 p-5 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto">
          Final Score = 0.40 × Skill Match + 0.25 × Interest Match + 0.15 × Branch Match + 0.10 × Experience Match + 0.10 × Eligibility Match
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-indigo-600 mb-1">40%</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Skill Match</h3>
            <p className="text-xs text-slate-600">
              Evaluates student skill overlap with required (85% weight) and preferred skills (15% bonus).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-purple-600 mb-1">25%</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Interest Match</h3>
            <p className="text-xs text-slate-600">
              Correlates student interest tags (e.g. AI, Web Dev) with opportunity domain & preferred types.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-blue-600 mb-1">15%</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Branch Match</h3>
            <p className="text-xs text-slate-600">
              100% for direct match or "All". 60% partial credit for related engineering disciplines.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-emerald-600 mb-1">10%</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Experience</h3>
            <p className="text-xs text-slate-600">
              Evaluates suitability between student proficiency (Beginner, Intermediate, Advanced) and role requirements.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-amber-600 mb-1">10%</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Eligibility</h3>
            <p className="text-xs text-slate-600">
              Validates that student academic year falls between minimum and maximum year thresholds.
            </p>
          </div>
        </div>
      </div>

      {/* NLP TF-IDF Semantic Matching (Section 11 requirement) */}
      <div className="bg-indigo-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          Natural Language Processing
        </div>
        <h2 className="text-2xl font-bold">
          TF-IDF Vectorization & Cosine Similarity
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Beyond discrete keyword matching, the engine leverages <strong className="text-white">scikit-learn TF-IDF (Term Frequency-Inverse Document Frequency)</strong> vectorization
          and cosine similarity. A comprehensive student document (skills, project descriptions, technologies, past work experience)
          is converted into an n-gram TF-IDF vector and compared against the opportunity description text.
        </p>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-200">
          Composite Score = (0.85 × Weighted Rule Score) + (0.15 × NLP Cosine Similarity × 100)
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Production Technology Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="font-bold text-slate-900 text-sm mb-1">FastAPI (Python)</div>
            <p className="text-xs text-slate-500">Asynchronous high-performance REST APIs</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="font-bold text-slate-900 text-sm mb-1">React + TypeScript</div>
            <p className="text-xs text-slate-500">Vite 8, Tailwind CSS, Lucide icons</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="font-bold text-slate-900 text-sm mb-1">Scikit-Learn NLP</div>
            <p className="text-xs text-slate-500">TF-IDF Vectorizer & Cosine Similarity</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="font-bold text-slate-900 text-sm mb-1">SQLAlchemy & SQLite/Postgres</div>
            <p className="text-xs text-slate-500">Relational schemas with cascading foreign keys</p>
          </div>
        </div>
      </div>
    </div>
  );
};
