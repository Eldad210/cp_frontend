
import { AnalysisResult, Plan } from '@/types';
import { RegionCode } from '@/types/codes';

// Function to get region-specific analysis results
export const getRegionSpecificResults = (region: RegionCode): AnalysisResult[] => {
  // Define IFC-specific issues
  switch (region) {
    case 'USA':
      return [
        {
          id: '1',
          severity: 'error',
          code: 'IBC-2021-1006.2',
          description: '3D model shows insufficient egress path width',
          location: 'Floor 1 - Corridor A',
          recommendation: 'Increase corridor width to minimum 44 inches',
          category: 'safety'
        },
        {
          id: '2',
          severity: 'warning',
          code: 'NFPA-101-7.2.2',
          description: 'Stairway dimensions in 3D model appear to be below minimum requirements',
          location: 'Stairwell B',
          recommendation: 'Verify stair riser and tread dimensions per NFPA 101',
          category: 'accessibility'
        }
      ];
    case 'ISRAEL':
      return [
        {
          id: '1',
          severity: 'error',
          code: 'SI-5281-4.1.3',
          description: '3D model shows insufficient thermal insulation in exterior walls',
          location: 'Building Envelope - South Façade',
          recommendation: 'Increase wall insulation to meet minimum R-value requirements',
          category: 'energy'
        },
        {
          id: '2',
          severity: 'warning',
          code: 'SI-1918-3.2.4',
          description: 'Structural support beams may not meet seismic requirements',
          location: 'Main Support Structure',
          recommendation: 'Review structural calculations for seismic zone compliance',
          category: 'structural'
        }
      ];
    default:
      return [];
  }
};

// Function to create a new plan with analysis results
export const createAnalyzedPlan = (file: File, region: RegionCode): Plan => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    uploadDate: new Date(),
    status: 'completed',
    results: getRegionSpecificResults(region)
  };
};
