import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Compass,
  Bookmark,
  Briefcase,
  Layers,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  GraduationCap,
  BarChart3,
  ListOrdered
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav(isAuthenticated ? (isAdmin ? 'admin-dashboard' : 'student-dashboard') : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                AI Opportunity Matcher
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                Career Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('landing')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'landing' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('all-opportunities')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'all-opportunities' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Explore Opportunities
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'about' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  How AI Matching Works
                </button>
              </>
            ) : isStudent ? (
              <>
                <button
                  onClick={() => handleNav('student-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'student-dashboard' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('recommended')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'recommended' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Recommended
                </button>
                <button
                  onClick={() => handleNav('all-opportunities')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'all-opportunities' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  All Opportunities
                </button>
                <button
                  onClick={() => handleNav('saved')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'saved' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  Saved
                </button>
                <button
                  onClick={() => handleNav('applied')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'applied' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Tracker
                </button>
                <button
                  onClick={() => handleNav('skill-gap')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'skill-gap' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-600" />
                  Skill Gap
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'admin-dashboard' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('manage-opportunities')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'manage-opportunities' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Manage Opportunities
                </button>
                <button
                  onClick={() => handleNav('student-management')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'student-management' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Students
                </button>
                <button
                  onClick={() => handleNav('admin-analytics')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'admin-analytics' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Analytics
                </button>
              </>
            )}
          </div>

          {/* User actions / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all hover:shadow-md"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isStudent && (
                  <button
                    onClick={() => handleNav('profile')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs">
                      {user?.name.charAt(0) || 'S'}
                    </div>
                    <span className="font-semibold text-xs sm:text-sm">{user?.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">
                      Student
                    </span>
                  </button>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-purple-50 border border-purple-200 text-purple-900">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-xs sm:text-sm">{user?.name}</span>
                    <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded-md font-bold uppercase">
                      Admin
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    logout();
                    setCurrentTab('landing');
                  }}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('all-opportunities')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
              >
                Explore Opportunities
              </button>
              <button
                onClick={() => handleNav('about')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
              >
                How Matching Works
              </button>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 text-center font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2.5 text-center font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : isStudent ? (
            <>
              <button
                onClick={() => handleNav('student-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-indigo-600" /> Dashboard
              </button>
              <button
                onClick={() => handleNav('recommended')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" /> Recommended For You
              </button>
              <button
                onClick={() => handleNav('all-opportunities')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <ListOrdered className="w-4 h-4 text-indigo-600" /> All Opportunities
              </button>
              <button
                onClick={() => handleNav('saved')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4 text-indigo-600" /> Saved Opportunities
              </button>
              <button
                onClick={() => handleNav('applied')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-indigo-600" /> Application Tracker
              </button>
              <button
                onClick={() => handleNav('skill-gap')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-purple-600" /> Skill Gap Analysis
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-indigo-600" /> My Profile
              </button>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setCurrentTab('landing');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-medium hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Admin Dashboard
              </button>
              <button
                onClick={() => handleNav('manage-opportunities')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-indigo-600" /> Manage Opportunities
              </button>
              <button
                onClick={() => handleNav('student-management')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" /> Student Management
              </button>
              <button
                onClick={() => handleNav('admin-analytics')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-indigo-600" /> Analytics
              </button>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setCurrentTab('landing');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-medium hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
