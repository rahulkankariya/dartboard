import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY || ""; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

export async function apiRequest<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
  // 1. Log BEFORE the try/catch to see if the function even starts
  console.log(">>> API REQUEST STARTED");
  console.log(">>> Base URL:", API_URL);
  console.log(">>> Full Path:", `${API_URL}${endpoint}`);

  try {
    const response = await apiClient<T>({
      url: endpoint,
      ...options,
      method: options.method || (options.data ? 'POST' : 'GET'),
    });

    // 2. This only logs if the status is 2xx
    console.log(`[API SUCCESS] ${endpoint} - Status: ${response.status}`);
    return response.data; 
  } catch (error: any) {
    // 3. Log the error specifically
    console.error("[API ERROR] Details:", error.response?.status, error.response?.data);
    const errorMessage = error.response?.data?.message || error.message || "Unknown API Error";
    throw new Error(errorMessage);
  }
}