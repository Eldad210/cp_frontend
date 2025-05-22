import { useAuthStore } from "@/store/authStore";

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
  selectedCodes: Array<{ countryCode: string; codeNum: string }>
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
    
    // Use the selected codes for analysis
    formData.append('items', JSON.stringify(selectedCodes));
    
    // The API URL from the provided specification
     const apiUrl = 'https://AnalyserAPI.onrender.com/analyse';

    //  const apiUrl = 'http://localhost:8000/analyse';
    
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

export interface CodeListResponse {
  success: boolean;
  message?: string;
  results?: Array<{
    countryCode: string;
    codeNum: string;
    description: string;
    name: string;
    category: string;
    categoryDescription?: string;
  }>;
}

export const getCodeList = async (
  filters?: {
    codeNum?: string[];
    category?: string[];
    countryCode?: string[];
    language?: string[];
  }
): Promise<CodeListResponse> => {
  try {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (filters?.codeNum) params.append('codeNum', filters.codeNum.join(','));
    if (filters?.category) params.append('category', filters.category.join(','));
    if (filters?.countryCode) params.append('countryCode', filters.countryCode.join(','));
    if (filters?.language) params.append('language', filters.language.join(','));
   
    
    const apiUrl = `https://AnalyserAPI.onrender.com/codeList?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
    console.error('Failed to fetch code list:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
