
import { RegionCode } from '@/types/codes';
import { FileUpload } from '../FileUpload';
import { CodeSelector } from '../CodeSelector';

interface SidePanelProps {
  selectedRegion: RegionCode;
  onRegionSelect: (region: RegionCode) => void;
  onFileSelect: (file: File) => void;
}

export function SidePanel({ selectedRegion, onRegionSelect, onFileSelect }: SidePanelProps) {
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
      </div>
    </div>
  );
}
