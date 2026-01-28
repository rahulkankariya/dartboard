import { z } from 'zod';

export const AuthSchema = z.object({
  firstName: z.string().min(2, "First name is too short").optional(),
  lastName: z.string().min(2, "Last name is too short").optional(),
  email: z.string().email("Invalid email address").trim(),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
   
});

// lib/definitions.ts

export type FormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  // Add this block to fix the error:
  user?: {
    firstName: string;
    lastName: string;
    email?: string;
    id?: string;
  } | null; 
};

export type AuthResponse = {
  message?: string;
  data?: {
    token: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
  token?: string; // Adding this as a fallback in case your API is flat
};

