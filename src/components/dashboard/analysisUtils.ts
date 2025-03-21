
import { AnalysisResult, Plan } from '@/types';
import { RegionCode } from '@/types/codes';

// Function to convert API response to AnalysisResult format
export const convertApiResultsToAnalysisResults = (apiResults: any[]): AnalysisResult[] => {
  return apiResults.flatMap(item => {
    // If there are no issues, return an empty array
    if (!item.issues || item.issues.length === 0) {
      return [];
    }
    
    // Map each issue to an AnalysisResult
    return item.issues.map((issue: any, index: number) => {
      const severity = issue.messageType === 'success' ? 'info' : issue.messageType;
      
      return {
        id: `${item.countryCode}-${item.codeNum}-${index}`,
        severity: severity as 'error' | 'warning' | 'info',
        code: item.codeNum,
        description: issue.message,
        location: 'Determined by analysis',
        recommendation: 'See details in message',
        // Default to 'general' but try to categorize based on code if possible
        category: getCategoryFromCode(item.codeNum)
      };
    });
  });
};

// Helper function to guess category from code
const getCategoryFromCode = (code: string): 'safety' | 'accessibility' | 'structural' | 'energy' | 'general' => {
  const lowerCode = code.toLowerCase();
  
  if (lowerCode.includes('safety') || lowerCode.includes('fire') || lowerCode.includes('emergency')) {
    return 'safety';
  }
  if (lowerCode.includes('access') || lowerCode.includes('ada')) {
    return 'accessibility';
  }
  if (lowerCode.includes('struct') || lowerCode.includes('load') || lowerCode.includes('seismic')) {
    return 'structural';
  }
  if (lowerCode.includes('energy') || lowerCode.includes('insul') || lowerCode.includes('thermal')) {
    return 'energy';
  }
  
  return 'general';
};

// Function to create a new plan with analysis results
export const createAnalyzedPlan = (
  file: File, 
  region: RegionCode, 
  apiResults?: any[]
): Plan => {
  let results: AnalysisResult[] = [];
  
  if (apiResults && apiResults.length > 0) {
    // Convert API results to our AnalysisResult format
    results = convertApiResultsToAnalysisResults(apiResults);
  } else {
    // Fallback to mock results if no API results provided
    results = getRegionSpecificResults(region);
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    uploadDate: new Date(),
    status: 'completed',
    results: results
  };
};

// Function to get region-specific mock analysis results (for fallback)
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
