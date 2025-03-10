
import { RegionCode } from '@/types/codes';
import { FileUpload } from '../FileUpload';
import { CodeSelector } from '../CodeSelector';
import { Button } from '../ui/button';
import { Rocket } from 'lucide-react';
import { Paper, Typography, Box, Divider } from '@mui/material';

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
    <Box className="lg:col-span-1 space-y-4">
      <Paper sx={{ p: 3, mb: 3 }}>
        <CodeSelector
          selectedRegion={selectedRegion}
          onRegionSelect={onRegionSelect}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload Plans
        </Typography>
        <FileUpload onFileSelect={onFileSelect} />
        
        <Box sx={{ mt: 3 }}>
          <Button 
            className="w-full"
            disabled={!selectedFile || !selectedRegion}
            onClick={onRunAnalysis}
            startIcon={<Rocket size={16} />}
          >
            Run Analysis
          </Button>
          
          {!selectedFile && (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 1 }}>
              Upload a file to run analysis
            </Typography>
          )}
          {!selectedRegion && (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 1 }}>
              Select a country to run analysis
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
