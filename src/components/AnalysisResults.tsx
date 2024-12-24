import { AnalysisResult } from '@/types';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const getSeverityIcon = (severity: AnalysisResult['severity']) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow p-4 border-l-4"
          style={{
            borderLeftColor:
              result.severity === 'error'
                ? '#ef4444'
                : result.severity === 'warning'
                ? '#f59e0b'
                : '#3b82f6',
          }}
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(result.severity)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Code: {result.code}
                </h4>
                <span className="text-xs text-gray-500">{result.location}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{result.description}</p>
              <p className="mt-2 text-sm text-blue-600">
                Recommendation: {result.recommendation}
              </p>
            </div>
          </div>
        </div>
      ))}
      {results.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">All Clear!</h3>
          <p className="mt-1 text-sm text-gray-500">
            No compliance issues were found in the plans.
          </p>
        </div>
      )}
    </div>
  );
}