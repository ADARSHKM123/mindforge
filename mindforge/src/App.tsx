import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { VocabularyProvider } from './contexts/VocabularyContext';
import BottomNav from './components/common/BottomNav';
import Onboarding from './components/onboarding/Onboarding';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import VocabularyPage from './pages/VocabularyPage';
import ProfilePage from './pages/ProfilePage';
import GameEngine from './components/games/GameEngine';

const AppContent: React.FC = () => {
  const { isOnboarded } = useUser();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/play/:gameId" element={<GameEngine />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <VocabularyProvider>
            <AppContent />
          </VocabularyProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
