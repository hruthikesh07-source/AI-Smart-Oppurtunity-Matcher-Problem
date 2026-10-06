import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Cpu,
  Key,
  Database,
  CheckCircle2,
  LogOut,
  Sliders,
  Sparkles
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [minMatchThreshold, setMinMatchThreshold] = useState(70);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Preferences saved successfully!');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
          Account & Application Settings
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Manage your account profile, recommendation sensitivity, and platform preferences.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          User Profile Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Account Name
            </span>
            <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Registered Email
            </span>
            <span className="text-sm font-semibold text-slate-800">{user?.email}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Role Authority
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
              {isAdmin ? <Shield className="w-3.5 h-3.5" /> : null}
              {user?.role.toUpperCase()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Auth Method
            </span>
            <span className="text-xs font-semibold text-slate-700">JWT Bearer Token (24h Expiry)</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {!isAdmin && (
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
            >
              Edit Student Profile
            </button>
          )}
          <button
            onClick={() => {
              logout();
              onNavigate('login');
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Matching Preferences Form */}
      <form onSubmit={handleSavePreferences} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          Recommendation Sensitivity & Notifications
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Minimum Match Score Sensitivity ({minMatchThreshold}%)
          </label>
          <input
            type="range"
            min={40}
            max={90}
            step={5}
            value={minMatchThreshold}
            onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>40% (Broad)</span>
            <span className="font-semibold text-indigo-600">{minMatchThreshold}% Recommended</span>
            <span>90% (Strict)</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Receive notifications when high-match opportunities (90%+) are added
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={deadlineReminders}
              onChange={(e) => setDeadlineReminders(e.target.checked)}
              className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Remind me 3 days before deadline on saved/applied opportunities
            </span>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* System Technical Parameters Card */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          AI Engine Specifications
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The current instance is operating with local TF-IDF cosine similarity vectorization and weighted multi-criteria ranking.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Skill Weight</span>
            <span className="text-sm font-bold text-indigo-600">40%</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Interest Weight</span>
            <span className="text-sm font-bold text-purple-600">25%</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Branch Weight</span>
            <span className="text-sm font-bold text-blue-600">15%</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Exp & Elig</span>
            <span className="text-sm font-bold text-emerald-600">20%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
