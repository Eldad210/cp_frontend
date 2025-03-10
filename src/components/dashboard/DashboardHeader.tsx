
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '@/types/auth';
import { AppBar, Toolbar, Typography, Box, Avatar, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <BusinessIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
        <Typography variant="h6" component="div" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Construction Plan Analyzer
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            avatar={<Avatar>{user?.name.charAt(0)}</Avatar>}
            label={`${user?.name} (${user?.role})`}
            variant="outlined"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            startIcon={<LogOut size={16} />}
          >
            Sign out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
