// src/components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { MultiChainSignIn } from './MultiChainSignIn';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => ( <svg className="h-5 w-5" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.924C34.783 5.344 29.697 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.645 3.284-2.671 7.031-2.671 11.139C3.635 30.969 4.661 34.716 6.306 37.999L12.55 32.8H6.306z"></path><path fill="#4CAF50" d="M24 45c5.697 0 10.783-2.344 14.802-5.924l-6.25-5.076c-2.119 1.885-4.902 3-7.552 3c-5.223 0-9.651-3.343-11.303-8H6.306c1.645 4.657 6.08 8 11.303 8L24 45z"></path><path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303a12.002 12.002 0 0 1-11.303 8l.001-.001l.001.001L24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.924A21.002 21.002 0 0 0 24 3L24 3c-11.57 0-21 9.43-21 21s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path> </svg> );

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fax, setFax] = useState(''); // Honeypot state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (fax) {
      setIsLoading(false);
      return; 
    }

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

      <div className="mt-6 space-y-4">
        <button onClick={handleGoogleSignIn} disabled={isLoading} className="flex w-full items-center justify-center gap-3 rounded-lg border border-secondary bg-background py-2.5 font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50">
          <GoogleIcon />
          <span>Sign up with Google</span>
        </button>
        <MultiChainSignIn />
      </div>
      
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-secondary"></div>
        <span className="mx-4 flex-shrink text-sm text-foreground/50">OR</span>
        <div className="flex-grow border-t border-secondary"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Display Name</label>
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
        
        <input type="text" name="fax" value={fax} onChange={(e) => setFax(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" />

        {error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <div>
          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center rounded-lg bg-accent py-2.5 font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account with Email'
            )}
          </button>
        </div>
      </form>
    </>
  );
}