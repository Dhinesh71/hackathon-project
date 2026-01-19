import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import './index.css';

// Protected Route Wrapper
const RequireAuth = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Redirect if already logged in
const RedirectIfAuth = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (session) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          } />
          <Route path="/verify" element={
            <RedirectIfAuth>
              <Verify />
            </RedirectIfAuth>
          } />
          <Route path="/" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
