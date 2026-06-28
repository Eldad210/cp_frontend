
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Building2, Lock, Mail, LogIn } from 'lucide-react';
import { Paper, Box, Typography, TextField, InputAdornment, CircularProgress, Alert } from '@mui/material';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from '@/i18n/LanguageProvider';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const { direction, t } = useTranslation();

  const localizeLoginError = (message: string) => {
    if (message === 'User not found') return t('auth.errorUserNotFound');
    if (message === 'Invalid password') return t('auth.errorWrongPassword');
    if (message === 'Invalid credentials') return t('auth.errorInvalidCredential');
    if (message === 'Login failed') return t('auth.errorLoginFailed');
    if (message === 'An unexpected error occurred') return t('auth.errorDefault');
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(localizeLoginError(err.message));
      } else {
        setError(t('auth.errorDefault'));
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
        bgcolor: '#f4f7f6',
        backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #f4f7f6 42%, #eef6f3 100%)',
        padding: { xs: 2, sm: 3 },
        animation: 'fadeIn 0.5s ease-out',
        direction,
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }}
    >
      <Box sx={{ position: 'fixed', top: 20, insetInlineEnd: 20 }}>
        <LanguageSwitcher />
      </Box>
      <Box 
        component={Paper} 
        elevation={0}
        sx={{ 
          maxWidth: '460px',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #dbe5e1',
          boxShadow: '0 18px 50px -34px rgba(15, 23, 42, 0.45)',
        }}
      >
        <Box sx={{ backgroundColor: 'white', padding: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                margin: '0 auto',
                height: '56px',
                width: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                backgroundColor: '#e6f4f1',
                border: '1px solid #c8e3dc',
                mb: 2,
              }}
            >
              <Building2 size={28} color="#0f766e" />
            </Box>
            <Typography variant="overline" sx={{ color: '#0f766e', fontWeight: 700, letterSpacing: 0 }}>
              {t('app.name')}
            </Typography>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 0.5,
                fontSize: '1.75rem',
                textAlign: 'center'
              }}
            >
              {t('login.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              {t('login.subtitle')}
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
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('login.emailLabel')}
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('login.emailPlaceholder')}
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
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('login.passwordLabel')}
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder={t('login.passwordPlaceholder')}
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
                  backgroundColor: '#0f766e',
                  '&:hover': {
                    backgroundColor: '#115e59',
                  },
                  color: 'white',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} thickness={4} sx={{ color: 'white' }} />
                    {t('login.loading')}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LogIn size={18} />
                    {t('login.submit')}
                  </Box>
                )}
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {t('login.footer')}
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
