import { CodeSelector } from '../CodeSelector';
import { Box } from '@mui/material';

interface SidePanelProps {
  onFileSelect: (file: File) => void;
  onRunAnalysis: () => void;
  selectedFile: File | null;
  isAnalyzing?: boolean;
  selectedCodes: Array<{ countryCode: string; codeNum: string }>;
  onCodeSelect: (codes: Array<{ countryCode: string; codeNum: string }>) => void;
}

export function SidePanel({ 
  selectedCodes,
  onCodeSelect
}: SidePanelProps) {
  return (
    <Box sx={{ height: '100%', p: 1.5, overflow: 'hidden' }}>
      <CodeSelector 
        selectedCodes={selectedCodes}
        onCodeSelect={onCodeSelect}
      />
    </Box>
  );
}
