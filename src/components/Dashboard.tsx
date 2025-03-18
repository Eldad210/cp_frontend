
import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { RegionCode } from '@/types/codes';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';
import { Box, Container, Grid, Snackbar, Alert } from '@mui/material';
import { sendAnalysisRequest } from '@/api/analysisService';

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>('ISRAEL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { user, logout } = useAuthStore();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile || !selectedRegion) {
      return;
    }

    // Set analyzing state and show info alert
    setIsAnalyzing(true);
    setAlert({ message: 'Analyzing file...', type: 'info' });
    
    try {
      // For now, let's just simulate the analysis 
      // by creating a plan directly without API call
      const newPlan = createAnalyzedPlan(selectedFile, selectedRegion);
      setActivePlan(newPlan);
      setAlert({ message: 'Analysis completed successfully', type: 'success' });
    } catch (error) {
      console.error('Error during analysis:', error);
      setAlert({ 
        message: error instanceof Error ? error.message : 'Unknown error occurred during analysis', 
        type: 'error' 
      });
    } finally {
      setIsAnalyzing(false);
    }
    
    // When ready to implement the actual API call, uncomment this:
    /*
    try {
      const response = await sendAnalysisRequest(selectedFile, selectedRegion);
      
      if (response.success) {
        // If successful, create a new plan with the results
        const newPlan = createAnalyzedPlan(selectedFile, selectedRegion);
        setActivePlan(newPlan);
        setAlert({ message: 'Analysis completed successfully', type: 'success' });
      } else {
        setAlert({ message: response.message || 'Analysis failed', type: 'error' });
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setAlert({ 
        message: error instanceof Error ? error.message : 'Unknown error occurred during analysis', 
        type: 'error' 
      });
    } finally {
      setIsAnalyzing(false);
    }
    */
  };

  const handleCloseAlert = () => {
    setAlert(null);
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
                isAnalyzing={isAnalyzing}
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
      
      {alert && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
