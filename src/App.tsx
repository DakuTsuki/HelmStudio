import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { SearchModal } from './components/SearchModal';
import { MonetizationModal } from './components/MonetizationModal';
import { AnimeRequestModal } from './components/AnimeRequestModal';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { SchedulePage } from './pages/SchedulePage';
import { EventsPage } from './pages/EventsPage';
import { CommunityPage } from './pages/CommunityPage';
import { NewsPage } from './pages/NewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';

import { Anime } from './types';
import { anilistService } from './services/anilist';
import confetti from 'canvas-confetti';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Modals
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMonetizationModal, setShowMonetizationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    content: string;
    type: 'comment' | 'user' | 'thread';
  }>({
    isOpen: false,
    content: '',
    type: 'comment'
  });

  // Open anime detail
  const handleSelectAnime = async (animeId: number) => {
    try {
      const anime = await anilistService.getAnimeById(animeId);
      if (anime) {
        setSelectedAnime(anime);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Surprise Me Random Anime
  const handleSurpriseMe = async () => {
    try {
      const random = await anilistService.getRandomAnime();
      if (random) {
        setSelectedAnime(random);
        setShowDetailModal(true);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Report opener
  const handleOpenReportModal = (content: string, type: 'comment' | 'user' | 'thread') => {
    setReportModalData({
      isOpen: true,
      content,
      type
    });
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setShowSearchModal(true)}
        onSurpriseMe={handleSurpriseMe}
        onOpenRequestModal={() => setShowRequestModal(true)}
        onOpenUpgradeModal={() => setShowMonetizationModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSelectAnime={handleSelectAnime}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onSelectAnime={handleSelectAnime}
            onNavigate={setCurrentView}
            onOpenUpgradeModal={() => setShowMonetizationModal(true)}
          />
        )}
        {currentView === 'browse' && (
          <BrowsePage onSelectAnime={handleSelectAnime} />
        )}
        {currentView === 'schedule' && (
          <SchedulePage onSelectAnime={handleSelectAnime} />
        )}
        {currentView === 'events' && (
          <EventsPage
            onOpenUpgradeModal={() => setShowMonetizationModal(true)}
            onOpenReportModal={handleOpenReportModal}
          />
        )}
        {currentView === 'community' && (
          <CommunityPage onOpenReportModal={handleOpenReportModal} />
        )}
        {currentView === 'news' && (
          <NewsPage />
        )}
        {currentView === 'profile' && (
          <ProfilePage
            onSelectAnime={handleSelectAnime}
            onOpenUpgradeModal={() => setShowMonetizationModal(true)}
          />
        )}
        {currentView === 'admin' && (
          <AdminDashboard onNavigate={setCurrentView} />
        )}
      </main>

      {/* Global Modals */}
      <AnimeDetailModal
        anime={selectedAnime}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onOpenReportModal={handleOpenReportModal}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectAnime={handleSelectAnime}
      />

      <MonetizationModal
        isOpen={showMonetizationModal}
        onClose={() => setShowMonetizationModal(false)}
      />

      <AnimeRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ReportModal
        isOpen={reportModalData.isOpen}
        targetContent={reportModalData.content}
        targetType={reportModalData.type}
        onClose={() => setReportModalData(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenRequestModal={() => setShowRequestModal(true)}
        onOpenUpgradeModal={() => setShowMonetizationModal(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
