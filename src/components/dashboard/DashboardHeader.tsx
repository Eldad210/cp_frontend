
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Building2, LogOut, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '@/types/auth';
import { RegionCode } from '@/types/codes';
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Paper, List, ListItemButton } from '@mui/material';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
  selectedRegion: RegionCode;
  onRegionSelect: (region: RegionCode) => void;
}

export function DashboardHeader({ user, onLogout, selectedRegion, onRegionSelect }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const countries: RegionCode[] = ['USA', 'ISRAEL'];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  
  const handleSelect = (country: RegionCode) => {
    onRegionSelect(country);
    setIsDropdownOpen(false);
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar sx={{ py: 1, px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Building2 color="#2563eb" size={32} />
          <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
            Construction Plan Analyzer
          </Typography>
        </Box>
        
        <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Globe size={18} color="#2563eb" />
            <Box sx={{ position: 'relative', width: 140 }}>
              <Button
                variant={selectedRegion ? "primary" : "outline"}
                size="sm"
                onClick={toggleDropdown}
                sx={{
                  justifyContent: 'space-between',
                  width: '100%',
                  py: 0.5,
                }}
                endIcon={<ChevronDown size={14} />}
              >
                {selectedRegion}
              </Button>
              
              {isDropdownOpen && (
                <Paper
                  sx={{
                    position: 'absolute',
                    zIndex: 1000,
                    mt: 0.5,
                    width: '100%',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <List sx={{ py: 0.5 }}>
                    {countries.map((country) => (
                      <ListItemButton
                        key={country}
                        onClick={() => handleSelect(country)}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          minHeight: 'auto',
                          backgroundColor: selectedRegion === country ? '#eff6ff' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#f9fafb'
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{country}</Typography>
                        {selectedRegion === country && (
                          <Check size={14} color="#2563eb" />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Box>
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
