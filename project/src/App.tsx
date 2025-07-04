import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DreamForm } from './components/DreamForm';
import { DreamList } from './components/DreamList';
import { DreamAnalysis } from './components/DreamAnalysis';
import { DreamVisualization } from './components/DreamVisualization';
import { Profile } from './components/Profile';
import { OnboardingFlow } from './components/OnboardingFlow';
import { UpgradeModal } from './components/UpgradeModal';
import { Plus } from 'lucide-react';
import { 
  saveUser, 
  getUser, 
  saveDream, 
  getDreams, 
  deleteDream, 
  getStats, 
  exportDreams,
  clearAllData,
  incrementTrialUsage,
  upgradeToPremium
} from './utils/storage';
import { analyzeDream } from './utils/dreamAnalysis';
import { Dream, User, DreamStats } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<DreamStats>({
    totalDreams: 0,
    averageMood: 0,
    averageLucidity: 0,
    mostCommonThemes: [],
    mostCommonSymbols: [],
    dreamingStreak: 0,
    monthlyDreams: Array(12).fill(0)
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDreamForm, setShowDreamForm] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    // Load user and dreams on startup
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
      const savedDreams = getDreams();
      setDreams(savedDreams);
      setStats(getStats());
    }
  }, []);

  const handleCompleteOnboarding = (newUser: User) => {
    setUser(newUser);
    saveUser(newUser);
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleSaveDream = (dreamData: Omit<Dream, 'id' | 'userId' | 'date'>) => {
    if (!user) return;

    const newDream: Dream = {
      ...dreamData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      date: new Date().toISOString()
    };

    // Check if analysis should be performed
    const shouldAnalyze = user.isPremium || user.trialAnalysesUsed < user.trialAnalysesLimit;
    
    if (shouldAnalyze && dreamData.isTrialAnalysis !== false) {
      // Analyze the dream
      const analysis = analyzeDream(newDream, user);
      newDream.analysis = analysis;
      newDream.themes = analysis.themes;
      newDream.symbols = analysis.symbols.map(s => s.symbol);

      // Increment trial usage if not premium
      if (!user.isPremium) {
        incrementTrialUsage(user.id);
        const updatedUser = getUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
      }
    }

    saveDream(newDream);
    setDreams(getDreams());
    setStats(getStats());
    setShowDreamForm(false);
    setActiveTab('dreams');
  };

  const handleEditDream = (dreamData: Omit<Dream, 'id' | 'userId' | 'date'>) => {
    if (!user || !editingDream) return;

    const updatedDream: Dream = {
      ...editingDream,
      ...dreamData
    };

    // Re-analyze the dream if it had analysis before
    if (editingDream.analysis) {
      const analysis = analyzeDream(updatedDream, user);
      updatedDream.analysis = analysis;
      updatedDream.themes = analysis.themes;
      updatedDream.symbols = analysis.symbols.map(s => s.symbol);
    }

    saveDream(updatedDream);
    setDreams(getDreams());
    setStats(getStats());
    setEditingDream(null);
    setShowDreamForm(false);
  };

  const handleDeleteDream = (dreamId: string) => {
    if (confirm('Are you sure you want to delete this dream?')) {
      deleteDream(dreamId);
      setDreams(getDreams());
      setStats(getStats());
      if (selectedDream?.id === dreamId) {
        setSelectedDream(null);
      }
    }
  };

  const handleDreamSelect = (dream: Dream) => {
    setSelectedDream(dream);
    setActiveTab('analysis');
  };

  const handleStartEditDream = (dream: Dream) => {
    setEditingDream(dream);
    setShowDreamForm(true);
  };

  const handleGenerateVisualization = (dreamId: string, style: string) => {
    // Simulate generating visualization
    const dreamsCopy = [...dreams];
    const dreamIndex = dreamsCopy.findIndex(d => d.id === dreamId);
    if (dreamIndex >= 0) {
      dreamsCopy[dreamIndex].visualizationUrl = `generated-${style}-${dreamId}`;
      setDreams(dreamsCopy);
      saveDream(dreamsCopy[dreamIndex]);
    }
  };

  const handleExportData = () => {
    const exportData = exportDreams();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dream-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
      setUser(null);
      setDreams([]);
      setStats({
        totalDreams: 0,
        averageMood: 0,
        averageLucidity: 0,
        mostCommonThemes: [],
        mostCommonSymbols: [],
        dreamingStreak: 0,
        monthlyDreams: Array(12).fill(0)
      });
      setActiveTab('dashboard');
    }
  };

  const handleUpgrade = () => {
    if (user) {
      upgradeToPremium(user.id);
      const updatedUser = getUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
      setShowUpgradeModal(false);
    }
  };

  const handleShowUpgrade = () => {
    setShowUpgradeModal(true);
  };

  // Show onboarding if no user
  if (!user) {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  // Show dream form
  if (showDreamForm) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user}>
        <DreamForm
          onSave={editingDream ? handleEditDream : handleSaveDream}
          onCancel={() => {
            setShowDreamForm(false);
            setEditingDream(null);
          }}
          user={user}
          onUpgrade={handleShowUpgrade}
        />
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user}>
      {/* Add Dream Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowDreamForm(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-105"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} user={user} onUpgrade={handleShowUpgrade} />
        )}
        
        {activeTab === 'dreams' && (
          <DreamList
            dreams={dreams}
            onDreamSelect={handleDreamSelect}
            onDeleteDream={handleDeleteDream}
            onEditDream={handleStartEditDream}
          />
        )}
        
        {activeTab === 'analysis' && selectedDream && selectedDream.analysis && (
          <DreamAnalysis dream={selectedDream} analysis={selectedDream.analysis} />
        )}
        
        {activeTab === 'journal' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dream Journal</h2>
            <div className="space-y-4">
              {dreams.map(dream => (
                <div key={dream.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{dream.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(dream.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{dream.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {dream.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'gallery' && selectedDream && (
          <DreamVisualization
            dream={selectedDream}
            onGenerateVisualization={handleGenerateVisualization}
          />
        )}
        
        {activeTab === 'profile' && (
          <Profile user={user} onUpdateUser={handleUpdateUser} />
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Export Data</h3>
                    <p className="text-sm text-gray-600">Download all your dreams and analysis</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Export
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-900">Clear All Data</h3>
                    <p className="text-sm text-red-600">Permanently delete all dreams and data</p>
                  </div>
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </Layout>
  );
}

export default App;