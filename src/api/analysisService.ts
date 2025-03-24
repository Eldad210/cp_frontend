import { RegionCode } from "@/types/codes";
import { useAuthStore } from "@/store/authStore";

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
    // Get the Firebase token from the auth store
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append('file', file);
    
    // Create items array based on region
    // You might want to get actual code numbers from your standards
    const items: AnalysisItem[] = [
      {
        countryCode: region === 'USA' ? 'US' : 'IL',
        codeNum: "1"
      }
    ];
    
    // Append items as JSON string
    formData.append('items', JSON.stringify(items));
    
    // The API URL from the provided specification
    const apiUrl = 'https://AnalyserAPI.onrender.com/analyze';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    debugger;
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
