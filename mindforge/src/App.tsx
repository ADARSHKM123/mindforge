import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { VocabularyProvider } from './contexts/VocabularyContext';
import AppShell from './components/layout/AppShell';
import Onboarding from './components/onboarding/Onboarding';
import TodayPage from './pages/TodayPage';
import TrainingPage from './pages/TrainingPage';
import VocabularyPage from './pages/VocabularyPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import ProPage from './pages/ProPage';
import GameHost from './components/games/GameHost';

const AppContent: React.FC = () => {
  const { isOnboarded } = useUser();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <Routes>
      {/* Full-screen routes without the shell */}
      <Route path="/play/:gameId" element={<GameHost />} />
      <Route path="/pro" element={<ProPage />} />

      {/* Shell routes */}
      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              <Route path="/home" element={<TodayPage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
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
