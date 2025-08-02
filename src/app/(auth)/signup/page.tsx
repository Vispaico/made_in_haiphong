// src/app/(auth)/signup/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Call our registration API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to create account.');
        return;
      }

      // 2. If registration is successful, automatically log the user in
      const signInResponse = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResponse?.error) {
        setError('Account created, but failed to log in. Please go to the login page.');
        return;
      }

      // 3. Redirect to the dashboard
      router.replace('/dashboard');

    } catch {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <>
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Create an Account</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in here
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
            Create Account
          </button>
        </div>
      </form>
    </>
  );
}