import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { useAuthStore } from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;