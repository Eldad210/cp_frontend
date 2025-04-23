import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { RuleAuthoringStudio } from './components/RuleAuthoringStudio';

import { Chat } from './components/Chat';
import { useAuthStore } from './store/authStore';
import { Box, CssBaseline } from '@mui/material';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
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
          <Route path="/create-validation" element={
            <ProtectedRoute>
              <RuleAuthoringStudio />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
