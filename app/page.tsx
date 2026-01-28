import { redirect } from 'next/navigation';

export default function RootPage() {
  // Automatically sends the user to the login screen
  redirect('/login');
}