
import { RegionCode } from "@/types/codes";

type AnalysisItem = {
  countryCode: string;
  codeNum: string;
};

export interface AnalysisRequest {
  file: string;
  items: AnalysisItem[];
}

export interface AnalysisResponse {
  success: boolean;
  message?: string;
  results?: any[]; // Replace with your actual response type
}

export const sendAnalysisRequest = async (
  file: File,
  region: RegionCode
): Promise<AnalysisResponse> => {
  try {
    // Convert file to base64
    const base64File = await fileToBase64(file);
    
    // Create items array based on region
    // You might want to get actual code numbers from your standards
    const items: AnalysisItem[] = [
      {
        countryCode: region === 'USA' ? 'US' : 'IL',
        codeNum: region === 'USA' ? 'IBC-2021-1006.2' : 'SI-5281-4.1.3'
      }
    ];
    
    const requestBody: AnalysisRequest = {
      file: base64File,
      items: items
    };
    
    // The API URL should come from environment variables in a production app
    const apiUrl = 'https://yourapi.example.com/analyze';
    
    // In a real app, you'd store this token securely
    const bearerToken = 'YOUR_BEARER_TOKEN';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Analysis request failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Helper function to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
