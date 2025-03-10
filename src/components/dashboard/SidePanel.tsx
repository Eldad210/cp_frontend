
import { RegionCode } from '@/types/codes';
import { FileUpload } from '../FileUpload';
import { CodeSelector } from '../CodeSelector';
import { Button } from '@mui/material';
import { Rocket } from 'lucide-react';
import { Box, Paper, Typography } from '@mui/material';

interface SidePanelProps {
  selectedRegion: RegionCode;
  onRegionSelect: (region: RegionCode) => void;
  onFileSelect: (file: File) => void;
  onRunAnalysis: () => void;
  selectedFile: File | null;
}

export function SidePanel({ 
  selectedRegion, 
  onRegionSelect, 
  onFileSelect,
  onRunAnalysis,
  selectedFile
}: SidePanelProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <CodeSelector
          selectedRegion={selectedRegion}
          onRegionSelect={onRegionSelect}
        />
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Upload Plans</Typography>
        <FileUpload onFileSelect={onFileSelect} />
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            disabled={!selectedFile || !selectedRegion}
            onClick={onRunAnalysis}
            startIcon={<Rocket size={16} />}
            sx={{ textTransform: 'none' }}
          >
            Run Analysis
          </Button>
          {!selectedFile && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
              Upload a file to run analysis
            </Typography>
          )}
          {!selectedRegion && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
              Select a country to run analysis
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
