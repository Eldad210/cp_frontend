
import { AnalysisResult } from '@/types';


interface PlanViewerProps {
  file: File | null;
  results?: AnalysisResult[];
}

export function PlanViewer({ file: _file, results: _results }: PlanViewerProps) {
  return (
    <div className="w-full h-full">
      {/* <AutodeskViewer file={file} results={results} /> */}
    </div>
  );
}
