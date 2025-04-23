import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';
import { Box, Snackbar, Alert, Button, Typography } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f1f5f9' }}>
      <DashboardHeader user={user} onLogout={logout} />
      
      <Box sx={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Left Panel - Codes */}
        <Box sx={{ 
          width: '320px', 
          borderRight: '1px solid #e2e8f0',
          bgcolor: '#ffffff'
        }}>
          <SidePanel 
            onFileSelect={handleFileSelect}
            onRunAnalysis={handleRunAnalysis}
            selectedFile={selectedFile}
            isAnalyzing={isAnalyzing}
            selectedCodes={selectedCodes}
            onCodeSelect={setSelectedCodes}
          />
        </Box>

        {/* Middle Panel - IFC Viewer */}
        <Box sx={{ 
          flex: 1,
          borderRight: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Upload Section - Always at top */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Box 
              component="label"
              sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#ffffff',
                borderRadius: '12px',
                border: '2px dashed #e2e8f0',
                p: 4,
                gap: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#3b82f6',
                  bgcolor: '#f8fafc'
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith('.ifc')) {
                  handleFileSelect(file);
                }
              }}
            >
              <Typography variant="h6">
                {selectedFile ? 'Change IFC File' : 'Upload Plans'}
              </Typography>
              {selectedFile ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  Current file: {selectedFile.name}
                </Typography>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Drag 'n' drop your IFC model here, or click to select file
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    IFC format only (max. 50MB)
                  </Typography>
                </>
              )}
              <input
                type="file"
                hidden
                accept=".ifc"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </Box>
          </Box>

          {/* IFC Viewer */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
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
                bgcolor: '#f8fafc'
              }}>
                <Typography color="text.secondary">
                  Upload an IFC file to view the model
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Panel - Analysis Results */}
        <Box sx={{ 
          width: '33%',
          bgcolor: '#f8fafc'
        }}>
          <ResultsPanel 
            onFileSelect={handleFileSelect}
            activePlan={activePlan}
            selectedFile={selectedFile}
            selectedRegion="ISRAEL"
            isAnalyzing={isAnalyzing}
            selectedCodes={selectedCodes}
            onRunAnalysis={handleRunAnalysis}
          />
        </Box>
      </Box>

      {/* Bottom Action Bar */}
      <Box sx={{ 
        p: 1.5, 
        borderTop: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        display: 'flex',
        gap: 2
      }}>
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
