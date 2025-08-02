// src/app/(auth)/login/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// A simple Google icon component
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.924C34.783 5.344 29.697 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.645 3.284-2.671 7.031-2.671 11.139C3.635 30.969 4.661 34.716 6.306 37.999L12.55 32.8H6.306z"></path><path fill="#4CAF50" d="M24 45c5.697 0 10.783-2.344 14.802-5.924l-6.25-5.076c-2.119 1.885-4.902 3-7.552 3c-5.223 0-9.651-3.343-11.303-8H6.306c1.645 4.657 6.08 8 11.303 8L24 45z"></path><path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303a12.002 12.002 0 0 1-11.303 8l.001-.001l.001.001L24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.924A21.002 21.002 0 0 0 24 3L24 3c-11.57 0-21 9.43-21 21s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error) {
        setError('Invalid email or password.');
        return;
      }
      router.replace('/dashboard');
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <>
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Log In</h2>
        <p className="mt-2 text-sm text-foreground/70">
          New to the platform?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
      
      <div className="mt-8">
        <button onClick={handleGoogleSignIn} className="flex w-full items-center justify-center gap-3 rounded-lg border border-secondary bg-background py-2.5 font-semibold text-foreground transition-colors hover:bg-secondary">
          <GoogleIcon />
          <span>Log in with Google</span>
        </button>
      </div>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-secondary"></div>
        <span className="mx-4 flex-shrink text-sm text-foreground/50">OR</span>
        <div className="flex-grow border-t border-secondary"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="email">Email Address</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"/>
        </div>
        <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"/>
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <div>
          <button type="submit" className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition-colors hover:bg-accent/90">
            Continue with Email
          </button>
        </div>
      </form>
    </>
  );
}