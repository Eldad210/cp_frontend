
import { useState } from 'react';
import { AnalysisResult, Plan } from '../../types';
import { ChevronDown, ChevronUp, FileSearch } from 'lucide-react';
import { PlanViewer } from '../PlanViewer';
import { AnalysisResults } from '../AnalysisResults';

interface ResultsPanelProps {
  activePlan: Plan | null;
  selectedFile: File | null;
  selectedRegion: string | null;
}

export function ResultsPanel({ activePlan, selectedFile, selectedRegion }: ResultsPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const getGroupedResults = (results: AnalysisResult[]) => {
    return results.reduce((groups, result) => {
      const category = result.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
      return groups;
    }, {} as Record<string, AnalysisResult[]>);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">Analysis Results</h2>
        {selectedRegion && (
          <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {selectedRegion} Standards
          </span>
        )}
      </div>
      
      {activePlan && selectedFile ? (
        <div className="space-y-6">
          <PlanViewer file={selectedFile} results={activePlan.results} />
          
          {/* Custom grouped display of results with collapse/expand */}
          <div className="space-y-4">
            {Object.entries(getGroupedResults(activePlan.results)).map(([category, results]) => (
              <div key={category} className="rounded-lg border border-gray-200 overflow-hidden">
                <div 
                  className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <h3 className="font-medium text-blue-800 capitalize">{category}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {results.length} issue{results.length !== 1 ? 's' : ''}
                    </span>
                    {expandedCategories[category] ? (
                      <ChevronUp className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </div>
                {expandedCategories[category] && (
                  <div className="divide-y divide-gray-100">
                    {results.map(result => (
                      <div key={result.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full ${
                            result.severity === 'error' 
                              ? 'bg-red-500' 
                              : result.severity === 'warning' 
                                ? 'bg-amber-500' 
                                : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">{result.code}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                result.severity === 'error' 
                                  ? 'bg-red-100 text-red-800' 
                                  : result.severity === 'warning' 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {result.severity}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">{result.description}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              <p><span className="font-medium">Location:</span> {result.location}</p>
                              <p className="mt-1"><span className="font-medium">Recommendation:</span> {result.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Original AnalysisResults component (hidden) */}
          <div className="hidden">
            <AnalysisResults results={activePlan.results} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>
            {selectedRegion
              ? 'Upload a plan to see analysis results'
              : 'Select a country to begin analysis'}
          </p>
        </div>
      )}
    </div>
  );
}
