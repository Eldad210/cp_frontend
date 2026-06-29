import { useAuthStore } from "@/store/authStore";
import { apiUrl } from "@/config/api";

const ANALYSIS_TIMEOUT_MS = 180_000;

export interface AnalysisServerStatus {
  ready: boolean;
  status?: number;
  message?: string;
}

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

export const checkAnalysisServerReadiness = async (): Promise<AnalysisServerStatus> => {
  try {
    const response = await fetch(apiUrl('/health'), { method: 'GET' });

    if (!response.ok) {
      return {
        ready: false,
        status: response.status,
        message: `Analysis server health check failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      ready: data.status === 'ok',
      status: response.status,
      message: data.firebaseError || undefined,
    };
  } catch (error) {
    return {
      ready: false,
      message: error instanceof Error ? error.message : 'Analysis server is unavailable',
    };
  }
};

export const sendAnalysisRequest = async (
  file: File,
  selectedCodes: Array<{ countryCode: string; codeNum: string }>,
  language: 'HE' | 'EN' = 'EN'
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
    formData.append('language', language);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);
    
    const response = await fetch(apiUrl('/analyse'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      signal: controller.signal,
    }).finally(() => window.clearTimeout(timeoutId));
    
    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        const detail = errorData?.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail
            .map((item) => item?.msg || JSON.stringify(item))
            .join(', ');
        }
      } catch {
        // Keep the HTTP status message when the server does not return JSON.
      }
      throw new Error(errorMessage);
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
      message: error instanceof DOMException && error.name === 'AbortError'
        ? 'Analysis timed out. Try a smaller file or fewer selected checks.'
        : error instanceof Error ? error.message : 'Unknown error occurred'
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
    category: string | string[];
    categoryDescription?: string | string[];
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

    const params = new URLSearchParams();
    filters?.codeNum?.forEach((codeNum) => params.append('codeNum', codeNum));
    filters?.category?.forEach((category) => params.append('category', category));
    filters?.countryCode?.forEach((countryCode) => params.append('countryCode', countryCode));
    filters?.language?.forEach((language) => params.append('language', language));
    
    const response = await fetch(apiUrl(`/codeList?${params.toString()}`), {
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
