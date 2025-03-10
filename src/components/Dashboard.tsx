
import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { RegionCode } from '@/types/codes';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';
import { Box, Container, Grid } from '@mui/material';

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>('ISRAEL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, logout } = useAuthStore();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRunAnalysis = () => {
    if (!selectedFile || !selectedRegion) {
      return;
    }

    // Simulate analysis process with region-specific results
    const newPlan = createAnalyzedPlan(selectedFile, selectedRegion);
    setActivePlan(newPlan);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader user={user} onLogout={logout} />

      <Box sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <SidePanel 
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
                onFileSelect={handleFileSelect}
                onRunAnalysis={handleRunAnalysis}
                selectedFile={selectedFile}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <ResultsPanel 
                activePlan={activePlan}
                selectedFile={selectedFile}
                selectedRegion={selectedRegion}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
