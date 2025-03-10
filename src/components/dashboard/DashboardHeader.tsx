
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Building2, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '@/types/auth';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar sx={{ py: 1, px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Building2 color="#2563eb" size={32} />
          <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
            Construction Plan Analyzer
          </Typography>
        </Box>
        
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome, {user?.name} ({user?.role})
          </Typography>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <LogOut size={16} />
            Sign out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
