
import { AnalysisResult } from '@/types';
import { AlertTriangle, CheckCircle, Construction, Eye, Flame, HardHat, Info, Shield, XCircle } from 'lucide-react';

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

  const getCategoryIcon = (category: AnalysisResult['category']) => {
    switch (category) {
      case 'safety':
        return <HardHat className="h-5 w-5 text-orange-500" />;
      case 'accessibility':
        return <Eye className="h-5 w-5 text-purple-500" />;
      case 'structural':
        return <Construction className="h-5 w-5 text-blue-600" />;
      case 'energy':
        return <Flame className="h-5 w-5 text-yellow-600" />;
      case 'general':
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  // Group results by category
  const resultsByCategory = results.reduce<Record<string, AnalysisResult[]>>((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  // Order categories by importance
  const categoryOrder: AnalysisResult['category'][] = ['safety', 'structural', 'accessibility', 'energy', 'general'];
  const sortedCategories = Object.keys(resultsByCategory).sort(
    (a, b) => categoryOrder.indexOf(a as any) - categoryOrder.indexOf(b as any)
  );

  return (
    <div className="space-y-6">
      {results.length > 0 ? (
        sortedCategories.map((category) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              {getCategoryIcon(category as AnalysisResult['category'])}
              <h3 className="text-md font-medium capitalize">{category}</h3>
              <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {resultsByCategory[category].length}
              </span>
            </div>
            
            {resultsByCategory[category].map((result) => (
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
          </div>
        ))
      ) : (
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
