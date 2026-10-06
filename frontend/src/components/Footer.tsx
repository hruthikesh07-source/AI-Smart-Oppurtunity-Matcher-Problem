import React from 'react';
import { Sparkles, Heart, ShieldCheck, Database, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">AI Smart Opportunity Matcher</span>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed mb-4">
              An intelligent, transparent career guidance and opportunity matching system for college students.
              Powered by modular NLP (TF-IDF), cosine similarity, and multi-criteria weighted scoring algorithms.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Scikit-Learn NLP
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                <Database className="w-3.5 h-3.5 text-indigo-600" /> PostgreSQL / SQLite
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> JWT Auth
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Platform Features</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>AI Opportunity Recommendations</li>
              <li>Multi-Criteria Scoring Engine</li>
              <li>Skill Gap & Demand Analytics</li>
              <li>Interactive Application Pipeline</li>
              <li>Explainable Recommendation Insights</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Demo Notice</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All initial sample opportunities are seeded as <strong className="text-slate-700">DEMO records</strong> for evaluation and research testing.
              No live external application deadlines are misrepresented.
            </p>
            <div className="mt-4 p-2.5 bg-indigo-50/70 rounded-lg text-xs text-indigo-800">
              <strong>Evaluation Credentials:</strong><br />
              Student: <code className="bg-indigo-100 px-1 rounded">student@demo.com</code><br />
              Admin: <code className="bg-indigo-100 px-1 rounded">admin@demo.com</code>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Smart Opportunity Matcher. Built for IEEE / B.Tech IT Major Project.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using FastAPI, Scikit-Learn & React
          </p>
        </div>
      </div>
    </footer>
  );
};
