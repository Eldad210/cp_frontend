import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { AnalysisResults } from './AnalysisResults';
import { PlanViewer } from './PlanViewer';
import { Plan } from '../types';
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
      alert('Please select a region code first');
      return;
    }

    setSelectedFile(file);

    // Simulate analysis process with region-specific results
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
    switch (region) {
      case 'USA':
        return [
          {
            id: '1',
            severity: 'error' as const,
            code: 'ADA-2010-404.2.3',
            description: 'Door clearance does not meet minimum requirements for wheelchair accessibility',
            location: 'Floor 1 - Main Entrance',
            recommendation: 'Increase door clearance to minimum 32 inches when opened 90 degrees'
          },
          {
            id: '2',
            severity: 'warning' as const,
            code: 'IBC-2021-1011.2',
            description: 'Stairway width appears to be below minimum requirements',
            location: 'Floor 2 - Emergency Stairwell',
            recommendation: 'Verify stairway width meets minimum 44 inches for occupant load > 50'
          }
        ];
      case 'ISRAEL':
        return [
          {
            id: '1',
            severity: 'error' as const,
            code: 'SI-5281-4.1.3',
            description: 'Insufficient thermal insulation in external walls',
            location: 'External Walls - All Floors',
            recommendation: 'Increase wall insulation to meet minimum R-value requirements'
          }
        ];
      case 'EUROPE':
        return [
          {
            id: '1',
            severity: 'warning' as const,
            code: 'EN-1990-A1.4.2',
            description: 'Structural load calculations require verification',
            location: 'Primary Structure',
            recommendation: 'Review load combinations according to Eurocode specifications'
          }
        ];
      default:
        return [];
    }
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
                    <AnalysisResults results={activePlan.results} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>
                      {selectedRegion
                        ? 'Upload a plan to see analysis results'
                        : 'Select a region code to begin analysis'}
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