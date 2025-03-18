
import { AnalysisResult } from '@/types';
import { AutodeskViewer } from './AutodeskViewer';

interface PlanViewerProps {
  file: File;
  results?: AnalysisResult[];
}

export function PlanViewer({ file, results }: PlanViewerProps) {
  return (
    <div className="w-full h-full">
      <AutodeskViewer file={file} results={results} />
    </div>
  );
}
