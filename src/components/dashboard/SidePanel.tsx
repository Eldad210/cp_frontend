import { FileUpload } from '../FileUpload';
import { CodeSelector } from '../CodeSelector';
import { Button, CircularProgress } from '@mui/material';
import { Rocket } from 'lucide-react';
import { Box, Paper, Typography, Grid } from '@mui/material';

interface SidePanelProps {
  onFileSelect: (file: File) => void;
  onRunAnalysis: () => void;
  selectedFile: File | null;
  isAnalyzing?: boolean;
  selectedCodes: Array<{ countryCode: string; codeNum: string }>;
  onCodeSelect: (codes: Array<{ countryCode: string; codeNum: string }>) => void;
}

export function SidePanel({ 
  onFileSelect,
  onRunAnalysis,
  selectedFile,
  isAnalyzing = false,
  selectedCodes,
  onCodeSelect
}: SidePanelProps) {
  return (
    <Grid container spacing={2}>
       <Grid item xs={12}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CodeSelector 
              selectedCodes={selectedCodes}
              onCodeSelect={onCodeSelect}
            />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        {/* <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Upload Plans</Typography>
            <FileUpload onFileSelect={onFileSelect} />
            
            <Box sx={{ mt: 2, width: '100%' }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                disabled={!selectedFile || isAnalyzing || selectedCodes.length === 0}
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
              {selectedFile && selectedCodes.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
                  Select at least one code to analyze
                </Typography>
              )}
            </Box>
          </Box>
        </Paper> */}
      </Grid>
     
    </Grid>
  );
}
