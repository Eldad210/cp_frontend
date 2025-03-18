
import { RegionCode } from '@/types/codes';
import { FileUpload } from '../FileUpload';
import { CodeSelector } from '../CodeSelector';
import { Button, CircularProgress } from '@mui/material';
import { Rocket } from 'lucide-react';
import { Box, Paper, Typography, Grid } from '@mui/material';

interface SidePanelProps {
  selectedRegion: RegionCode;
  onRegionSelect: (region: RegionCode) => void;
  onFileSelect: (file: File) => void;
  onRunAnalysis: () => void;
  selectedFile: File | null;
  isAnalyzing?: boolean;
}

export function SidePanel({ 
  selectedRegion, 
  onRegionSelect, 
  onFileSelect,
  onRunAnalysis,
  selectedFile,
  isAnalyzing = false
}: SidePanelProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <CodeSelector
            selectedRegion={selectedRegion}
            onRegionSelect={onRegionSelect}
          />
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Upload Plans</Typography>
            <FileUpload onFileSelect={onFileSelect} />
            
            <Box sx={{ mt: 2, width: '100%' }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                disabled={!selectedFile || !selectedRegion || isAnalyzing}
                onClick={onRunAnalysis}
                startIcon={isAnalyzing ? <CircularProgress size={16} color="inherit" /> : <Rocket size={16} />}
                sx={{ textTransform: 'none' }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
              </Button>
              {!selectedFile && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
                  Upload a file to run analysis
                </Typography>
              )}
              {!selectedRegion && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
                  Select a country to run analysis
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
