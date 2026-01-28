export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}