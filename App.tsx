import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { BoardsPage } from './pages/BoardsPage';
import { FinancePage } from './pages/FinancePage';
import { CRMPage } from './pages/CRM/CRMPage';
import { FocusPage } from './pages/FocusPage';
import { HabitsMood } from './pages/HabitsMood';
import { NewsPage } from './pages/NewsPage';
import { AdminPage } from './pages/AdminPage';
import { DataProvider, useData } from './context/DataContext';
import { LoginPage } from './components/LoginPage';
import { SetupPage } from './components/SetupPage';

// Wrapper component to handle routing logic based on state
const AppRoutes: React.FC = () => {
  const { isLoggedIn, supabaseConfig } = useData();

  // Condition A: Supabase not configured -> Show Setup
  // Check specifically for URL and Key existence
  if (!supabaseConfig.url || !supabaseConfig.key) {
    return <SetupPage />;
  }

  // Condition B: Configured but not logged in -> Show Login
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // Condition C: Logged in -> Show Dashboard
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="boards" element={<BoardsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="habits" element={<HabitsMood />} />
          <Route path="mood" element={<Navigate to="/habits" replace />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
       <AppRoutes />
    </DataProvider>
  );
};

export default App;