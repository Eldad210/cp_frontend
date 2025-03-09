
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { AnalysisResults } from './AnalysisResults';
import { PlanViewer } from './PlanViewer';
import { AnalysisResult, Plan } from '../types';
import { Building2, FileSearch, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { CodeSelector } from './CodeSelector';
import { RegionCode } from '@/types/codes';

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, logout } = useAuthStore();

  const handleFileSelect = (file: File) => {
    if (!selectedRegion) {
      alert('Please select a country first');
      return;
    }

    setSelectedFile(file);

    // Simulate analysis process with region-specific results for IFC files
    const newPlan: Plan = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      uploadDate: new Date(),
      status: 'completed',
      results: getRegionSpecificResults(selectedRegion)
    };
    setActivePlan(newPlan);
  };

  const getRegionSpecificResults = (region: RegionCode) => {
    // Define IFC-specific issues
    switch (region) {
      case 'USA':
        return [
          {
            id: '1',
            severity: 'error' as const,
            code: 'IBC-2021-1006.2',
            description: '3D model shows insufficient egress path width',
            location: 'Floor 1 - Corridor A',
            recommendation: 'Increase corridor width to minimum 44 inches',
            category: 'safety' as const
          },
          {
            id: '2',
            severity: 'warning' as const,
            code: 'NFPA-101-7.2.2',
            description: 'Stairway dimensions in 3D model appear to be below minimum requirements',
            location: 'Stairwell B',
            recommendation: 'Verify stair riser and tread dimensions per NFPA 101',
            category: 'accessibility' as const
          }
        ];
      case 'ISRAEL':
        return [
          {
            id: '1',
            severity: 'error' as const,
            code: 'SI-5281-4.1.3',
            description: '3D model shows insufficient thermal insulation in exterior walls',
            location: 'Building Envelope - South Façade',
            recommendation: 'Increase wall insulation to meet minimum R-value requirements',
            category: 'energy' as const
          },
          {
            id: '2',
            severity: 'warning' as const,
            code: 'SI-1918-3.2.4',
            description: 'Structural support beams may not meet seismic requirements',
            location: 'Main Support Structure',
            recommendation: 'Review structural calculations for seismic zone compliance',
            category: 'structural' as const
          }
        ];
      default:
        return [];
    }
  };

  // Group results by category
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Construction Plan Analyzer</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <CodeSelector
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Plans</h2>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            </div>

            <div className="lg:col-span-2">
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
                    
                    {/* Custom grouped display of results */}
                    <div className="space-y-4">
                      {Object.entries(getGroupedResults(activePlan.results)).map(([category, results]) => (
                        <div key={category} className="rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-medium text-blue-800 capitalize">{category}</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {results.length} issue{results.length !== 1 ? 's' : ''}
                            </span>
                          </div>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
