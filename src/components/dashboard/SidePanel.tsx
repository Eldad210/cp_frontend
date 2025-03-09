
import { RegionCode } from '@/types/codes';
import { FileUpload } from '../FileUpload';
import { CodeSelector } from '../CodeSelector';
import { Button } from '../ui/button';
import { Rocket } from 'lucide-react';

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
    <div className="lg:col-span-1 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <CodeSelector
          selectedRegion={selectedRegion}
          onRegionSelect={onRegionSelect}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Plans</h2>
        <FileUpload onFileSelect={onFileSelect} />
        
        <div className="mt-6">
          <Button 
            className="w-full flex items-center justify-center gap-2"
            disabled={!selectedFile || !selectedRegion}
            onClick={onRunAnalysis}
          >
            <Rocket className="h-4 w-4" />
            Run Analysis
          </Button>
          {!selectedFile && (
            <p className="text-xs text-gray-500 mt-2 text-center">Upload a file to run analysis</p>
          )}
          {!selectedRegion && (
            <p className="text-xs text-gray-500 mt-2 text-center">Select a country to run analysis</p>
          )}
        </div>
      </div>
    </div>
  );
}
