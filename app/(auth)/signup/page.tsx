import { AuthForm } from '@/components/auth-form';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  // If user is already logged in, redirect to dashboard immediately
  if (session) {
    redirect("/dashboard");
  }
  return <AuthForm mode="signup" />;
}