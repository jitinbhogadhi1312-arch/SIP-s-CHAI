import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useAppContext } from './context/AppContext';

// Layout & Components
import { AppLayout } from './layouts/AppLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Stock } from './pages/Stock';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function ProtectedRoute({ children, reqRole }: { children: React.ReactNode, reqRole?: 'owner' | 'staff' }) {
  const { isLoggedIn, role } = useAppContext();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (reqRole === 'owner' && role !== 'owner') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />} />
      
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/stock" element={<Stock />} />
        
        {/* Owner Only Routes */}
        <Route path="/reports" element={<ProtectedRoute reqRole="owner"><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute reqRole="owner"><Settings /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </AppProvider>
    </BrowserRouter>
  );
}
