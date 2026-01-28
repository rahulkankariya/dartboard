import { apiRequest } from './api-client';
import { AuthResponse } from '@/types/auth';

/**
 * Service to handle all Authentication API calls
 */
export const authService = {
  /**
   * Logs in a user and returns token/user data
   */
  async login(payload: Record<string, any>): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/login', {
      method: 'POST',
      data: payload,
    });
  },

  /**
   * Registers a new user and returns token/user data
   */
  async signup(payload: Record<string, any>): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/signup', {
      method: 'POST',
      data: payload,
    });
  },

  /**
   * Example: Get current user profile using the token
   */
  async getProfile(token: string): Promise<AuthResponse['user']> {
    return apiRequest<AuthResponse['user']>('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};