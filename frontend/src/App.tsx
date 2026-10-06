import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { Opportunity } from './types';
import { savedService, applicationService } from './services/api';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfilePage } from './pages/StudentProfile';
import { RecommendedOpportunities } from './pages/RecommendedOpportunities';
import { AllOpportunities } from './pages/AllOpportunities';
import { SavedOpportunities } from './pages/SavedOpportunities';
import { AppliedOpportunities } from './pages/AppliedOpportunities';
import { SkillGapAnalysis } from './pages/SkillGapAnalysis';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageOpportunities } from './pages/ManageOpportunities';
import { StudentManagement } from './pages/StudentManagement';
import { AdminAnalytics } from './pages/AdminAnalytics';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin, isStudent } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const handleViewDetails = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
  };

  const handleCloseDetails = () => {
    setSelectedOpportunity(null);
  };

  const handleToggleSave = async (opp: Opportunity) => {
    if (!isAuthenticated) {
      setCurrentTab('login');
      return;
    }
    try {
      if (opp.is_saved) {
        await savedService.removeSaved(opp.id);
        opp.is_saved = false;
      } else {
        await savedService.saveOpportunity(opp.id);
        opp.is_saved = true;
      }
      if (selectedOpportunity && selectedOpportunity.id === opp.id) {
        setSelectedOpportunity({ ...selectedOpportunity, is_saved: opp.is_saved });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (opportunityId: number, status: string, notes?: string) => {
    if (!isAuthenticated) {
      setCurrentTab('login');
      return;
    }
    try {
      await applicationService.createOrUpdateApplication({
        opportunity_id: opportunityId,
        status,
        notes
      });
      if (selectedOpportunity && selectedOpportunity.id === opportunityId) {
        setSelectedOpportunity({
          ...selectedOpportunity,
          application_status: status as any
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Route protection
  const renderCurrentPage = () => {
    // Public routes
    if (currentTab === 'landing') {
      return <LandingPage onNavigate={setCurrentTab} onViewDetails={handleViewDetails} />;
    }
    if (currentTab === 'about') {
      return <AboutPage />;
    }
    if (currentTab === 'login') {
      return <LoginPage onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'register') {
      return <RegisterPage onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'all-opportunities') {
      return <AllOpportunities onViewDetails={handleViewDetails} />;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <LoginPage onNavigate={setCurrentTab} />;
    }

    // Admin-only routes
    if (isAdmin) {
      if (currentTab === 'admin-dashboard') {
        return <AdminDashboard onNavigate={setCurrentTab} />;
      }
      if (currentTab === 'manage-opportunities') {
        return <ManageOpportunities onViewDetails={handleViewDetails} />;
      }
      if (currentTab === 'student-management') {
        return <StudentManagement />;
      }
      if (currentTab === 'admin-analytics') {
        return <AdminAnalytics />;
      }
      if (currentTab === 'settings') {
        return <SettingsPage onNavigate={setCurrentTab} />;
      }
      return <AdminDashboard onNavigate={setCurrentTab} />;
    }

    // Student routes
    if (currentTab === 'student-dashboard') {
      return <StudentDashboard onNavigate={setCurrentTab} onViewDetails={handleViewDetails} />;
    }
    if (currentTab === 'profile') {
      return <StudentProfilePage onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'recommended') {
      return <RecommendedOpportunities onViewDetails={handleViewDetails} onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'saved') {
      return <SavedOpportunities onViewDetails={handleViewDetails} onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'applied') {
      return <AppliedOpportunities onViewDetails={handleViewDetails} onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'skill-gap') {
      return <SkillGapAnalysis onNavigate={setCurrentTab} />;
    }
    if (currentTab === 'settings') {
      return <SettingsPage onNavigate={setCurrentTab} />;
    }

    return <StudentDashboard onNavigate={setCurrentTab} onViewDetails={handleViewDetails} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer />

      {/* Global Opportunity Details Modal */}
      {selectedOpportunity && (
        <OpportunityDetailsModal
          opportunity={selectedOpportunity}
          onClose={handleCloseDetails}
          onSave={handleToggleSave}
          onStatusChange={handleStatusChange}
          isSaved={selectedOpportunity.is_saved}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
