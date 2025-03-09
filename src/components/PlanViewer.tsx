
import { AnalysisResult } from '@/types';
import { IFCViewer } from './IFCViewer';

interface PlanViewerProps {
  file: File;
  results?: AnalysisResult[];
}

export function PlanViewer({ file }: PlanViewerProps) {
  return <IFCViewer file={file} />;
}
