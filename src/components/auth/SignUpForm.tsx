// src/components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input'; // THE FIX: Import our new Input component

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      router.push('/login?status=success');
    } else {
      const errorData = await response.text();
      setError(errorData || 'Failed to create account. Please try again.');
    }
    setIsLoading(false);
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
            <label htmlFor="name" className="text-sm font-medium">Display Name</label>
            {/* THE FIX: Replaced <input> with our new <Input /> component */}
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" required />
        </div>
        <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            <p className="text-xs text-foreground/60">Must be at least 8 characters and include an uppercase letter, a number, and a special character.</p>
        </div>
        
        {error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <div>
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </>
  );
}