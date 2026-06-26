const DEFAULT_API_BASE_URL = "https://AnalyserAPI.onrender.com";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
