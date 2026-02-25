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
  // console.log(">>> API REQUEST STARTED");
  // console.log(">>> Base URL:", API_URL);
  // console.log(">>> Full Path:", `${API_URL}${endpoint}`);

 try {
  const response = await apiClient<T>({
    url: endpoint,
    // Explicitly use the method passed from service, 
    // only fallback to POST/GET if not provided
    method: options.method || (options.data ? 'POST' : 'GET'),
    ...options,
  });

  return response.data; 
} catch (error: any) {
  if (error.response) {
      // This is what handleDelete needs to see the 400 message
      throw error; 
    }
    throw new Error("Network error");
}
}