export interface AnalysisResult {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  description: string;
  location: string;
  recommendation: string;
  category: 'safety' | 'accessibility' | 'structural' | 'energy' | 'general';
}

export interface Plan {
  id: string;
  name: string;
  uploadDate: Date;
  status: 'analyzing' | 'completed' | 'error';
  results: AnalysisResult[];
}
