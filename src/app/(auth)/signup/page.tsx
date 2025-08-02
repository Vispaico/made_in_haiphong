// src/app/(auth)/signup/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      // On success, redirect to the login page with a success message
      router.push('/login?status=success');

    } catch {
      setError('An unexpected error occurred.');
      setIsLoading(false);
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
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"/>
        </div>
        <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"/>
            <p className="text-xs text-foreground/60">
              Must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.
            </p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </>
  );
}