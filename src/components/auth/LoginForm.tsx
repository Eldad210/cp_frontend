
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Lock, Mail, LogIn } from 'lucide-react';
import { Paper, Box, Typography, TextField, InputAdornment, CircularProgress, Alert } from '@mui/material';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #EEF2FF, #E0E7FF)',
        padding: '8px',
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }}
    >
      <Box 
        component={Paper} 
        elevation={6}
        sx={{ 
          maxWidth: '450px',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Box sx={{ backgroundColor: 'white', padding: '20px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                margin: '0 auto',
                height: '56px',
                width: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#EEF2FF',
                mb: 2,
                transition: 'all 0.5s ease',
                '&:hover': {
                  transform: 'rotate(12deg) scale(1.05)',
                  backgroundColor: 'rgba(63, 81, 181, 0.15)'
                }
              }}
            >
              <Lock size={28} color="#3b82f6" />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 0.5,
                fontSize: '1.75rem'
              }}
            >
              Sign in
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access the Construction Plan Analyzer
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '8px',
                  marginBottom: '16px',
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ marginBottom: '16px' }}>
              <Box sx={{ marginBottom: '12px' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, ml: 0.5 }}>
                  Email address
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, ml: 0.5 }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                sx={{
                  width: '100%',
                  padding: '10px 0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  },
                  color: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} thickness={4} sx={{ color: 'white', mr: 1.5 }} />
                    Signing in...
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LogIn size={18} style={{ marginRight: 6 }} />
                    Sign in
                  </Box>
                )}
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                By signing in, you agree to the Civil Planner Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
