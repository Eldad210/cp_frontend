import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';
import { Box, Container, Grid, Snackbar, Alert, Button, Typography } from '@mui/material';
import { sendAnalysisRequest } from '@/api/analysisService';
import { useNavigate } from 'react-router-dom';
import { IFCViewer } from "./IFCViewer";

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<{ countryCode: string; codeNum: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader user={user} onLogout={logout} />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <Box sx={{ width: '33.33%', borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          <SidePanel 
            onFileSelect={handleFileSelect}
            onRunAnalysis={handleRunAnalysis}
            selectedFile={selectedFile}
            isAnalyzing={isAnalyzing}
            selectedCodes={selectedCodes}
            onCodeSelect={setSelectedCodes}
          />
        </Box>

        {/* Middle Panel */}
        <Box sx={{ width: '33.33%', borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          <ResultsPanel 
            onFileSelect={handleFileSelect}
            activePlan={activePlan}
            selectedFile={selectedFile}
            selectedRegion="ISRAEL"
          />
        </Box>

        {/* Right Panel - IFC Viewer */}
        <Box sx={{ width: '33.33%', overflow: 'hidden' }}>
          {selectedFile ? (
            <IFCViewer 
              file={selectedFile}
              onError={(error) => setAlert({ message: error.message, type: 'error' })}
            />
          ) : (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'grey.100'
            }}>
              <Typography variant="body1" color="text.secondary">
                Upload an IFC file to view the model
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, bgcolor: 'grey.100', borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create-validation')}
        >
          Create Validation
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || !selectedFile || selectedCodes.length === 0}
        >
          Run Analysis
        </Button>
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
