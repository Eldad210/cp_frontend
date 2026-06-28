import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { Building2, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '@/types/auth';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from '@/i18n/LanguageProvider';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const { t } = useTranslation();

  const roleLabel = (() => {
    if (user?.role === 'admin') return t('auth.role.admin');
    if (user?.role === 'reviewer') return t('auth.role.reviewer');
    if (user?.role === 'engineer') return t('auth.role.engineer');
    return t('auth.role.user');
  })();
  const userName = user?.name && user.name !== 'User' ? user.name : user?.email;

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: '#e2e8f0',
      bgcolor: '#ffffff',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      px: 3
    }}>
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', border: '1px solid #eef2f7' }}>
        <Toolbar sx={{ py: 1, px: { xs: 2, sm: 3, lg: 4 }, minHeight: '58px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#e6f4f1',
              border: '1px solid #c8e3dc',
            }}>
              <Building2 color="#0f766e" size={24} />
            </Box>
            <Box>
              <Typography variant="h6" component="h1" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.1 }}>
                {t('app.name')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('app.product')}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${t('header.welcome')}, ${userName || roleLabel}`}
              size="small"
              sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', maxWidth: 260 }}
            />
            <LanguageSwitcher />
            <Box sx={{ display: 'flex' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LogOut size={16} />
                {t('header.signOut')}
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
