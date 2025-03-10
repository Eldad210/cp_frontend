
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
        if (err.message === 'Unauthorized email') {
          setError('Access restricted to boris@civilplanner.co only');
        } else if (err.message === 'Invalid password') {
          setError('Incorrect password');
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setIsLoading(false);
    }
  };

  return (
    <Box 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
      sx={{ 
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
        className="max-w-md w-full space-y-8"
        sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Box className="bg-white p-8 rounded-t-xl">
          <Box className="flex flex-col items-center" sx={{ mb: 4 }}>
            <Box 
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4"
              sx={{ 
                transition: 'all 0.5s ease',
                '&:hover': {
                  transform: 'rotate(12deg) scale(1.05)',
                  backgroundColor: 'rgba(63, 81, 181, 0.15)'
                }
              }}
            >
              <Lock className="h-8 w-8 text-blue-600" />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 1 
              }}
            >
              Sign in
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access the Construction Plan Analyzer
            </Typography>
          </Box>
          
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '8px',
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
            
            <Box className="space-y-4">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
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
                        <Mail className="h-5 w-5 text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
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
                        <Lock className="h-5 w-5 text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
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
                className="w-full py-3 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                disabled={isLoading}
                size="lg"
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <Box className="flex items-center">
                    <CircularProgress size={24} thickness={4} sx={{ color: 'white', mr: 2 }} />
                    Signing in...
                  </Box>
                ) : (
                  <Box className="flex items-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in
                  </Box>
                )}
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
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
