"use server";

import { authService } from "@/lib/api-service";
import { AuthSchema, FormState, AuthResponse } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticate(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = AuthSchema.safeParse(rawData);

  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors, 
      message: "Check your tactical data input." 
    };
  }

  let success = false;
  let userData = null;

  try {
    const isSignup = rawData.mode === "signup";
    const response: AuthResponse = isSignup 
      ? await authService.signup(validated.data)
      : await authService.login(validated.data);

    const token = response.data?.token || response.token;
    
    // Extract user data for the frontend to save in localStorage
    userData = response.data?.user || null;
    console.log("Authenticated User Data:", userData);
    if (!token) {
      throw new Error(response.message || "No access token received.");
    }

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, 
      sameSite: "lax",
    });

    success = true;
  } catch (error: any) {
    return { 
      message: error.message || "Connection to HQ failed.", 
      errors: {} 
    };
  }

  // Redirect occurs only on success
  if (success) {
    // IMPORTANT: We don't return here because redirect() throws an error by design
    redirect("/dashboard");
  }

  return { 
    message: "Success", 
    user: userData, // This is passed back to your Client Component
    errors: {} 
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}