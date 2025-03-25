import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';
import { Box, Container, Grid, Snackbar, Alert } from '@mui/material';
import { sendAnalysisRequest } from '@/api/analysisService';

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<{ countryCode: string; codeNum: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { user, logout } = useAuthStore();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile || selectedCodes.length === 0) {
      return;
    }

    // Set analyzing state and show info alert
    setIsAnalyzing(true);
    setAlert({ message: 'Analyzing file...', type: 'info' });
    
    try {
      // Call the actual API service with selected codes
      const response = await sendAnalysisRequest(selectedFile, selectedCodes);
      
      if (response.success && response.results) {
        // Create a plan with the API response results
        const newPlan = createAnalyzedPlan(selectedFile, 'ISRAEL', response.results);
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
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader user={user} onLogout={logout} />

      <Box sx={{ flexGrow: 1, py: 2, px: { xs: 1, sm: 2 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={3}>
              <Box sx={{ position: 'sticky', top: 16 }}>
                <SidePanel 
                  onFileSelect={handleFileSelect}
                  onRunAnalysis={handleRunAnalysis}
                  selectedFile={selectedFile}
                  isAnalyzing={isAnalyzing}
                  selectedCodes={selectedCodes}
                  onCodeSelect={setSelectedCodes}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <ResultsPanel 
                activePlan={activePlan}
                selectedFile={selectedFile}
                selectedRegion="ISRAEL"
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
