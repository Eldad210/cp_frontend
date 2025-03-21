
import { RegionCode } from "@/types/codes";

type AnalysisItem = {
  countryCode: string;
  codeNum: string;
};

export interface AnalysisResponse {
  success: boolean;
  message?: string;
  results?: Array<{
    countryCode: string;
    codeNum: string;
    checked: boolean;
    checkedCorrectly: boolean;
    issues?: Array<{
      messageType: "error" | "warning" | "success";
      message: string;
    }>;
  }>;
}

export const sendAnalysisRequest = async (
  file: File,
  region: RegionCode
): Promise<AnalysisResponse> => {
  try {
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append('file', file);
    
    // Create items array based on region
    // You might want to get actual code numbers from your standards
    const items: AnalysisItem[] = [
      {
        countryCode: region === 'USA' ? 'US' : 'IL',
        codeNum: region === 'USA' ? 'IBC-2021-1006.2' : 'SI-5281-4.1.3'
      }
    ];
    
    // Append items as JSON string
    formData.append('items', JSON.stringify(items));
    
    // The API URL from the provided specification
    const apiUrl = 'https://AnalyserAPI.onrender.com/analyze';
    
    // In a real app, you'd store this token securely
    const bearerToken = 'YOUR_BEARER_TOKEN';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      results: data.results
    };
  } catch (error) {
    console.error('Analysis request failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
