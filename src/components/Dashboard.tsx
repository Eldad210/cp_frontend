
import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { RegionCode } from '@/types/codes';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>('ISRAEL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, logout } = useAuthStore();

  const handleFileSelect = (file: File) => {
    if (!selectedRegion) {
      alert('Please select a country first');
      return;
    }

    setSelectedFile(file);

    // Simulate analysis process with region-specific results
    const newPlan = createAnalyzedPlan(file, selectedRegion);
    setActivePlan(newPlan);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SidePanel 
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              onFileSelect={handleFileSelect}
            />

            <div className="lg:col-span-2">
              <ResultsPanel 
                activePlan={activePlan}
                selectedFile={selectedFile}
                selectedRegion={selectedRegion}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
