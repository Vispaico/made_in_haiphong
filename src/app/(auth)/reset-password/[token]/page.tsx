// src/app/(auth)/reset-password/[token]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.text();
    if (response.ok) {
      setMessage(data);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(data);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Reset Your Password</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Choose a new, strong password for your account.
        </p>
      </div>

      {message && <p className="mt-6 rounded-md bg-green-500/10 p-3 text-sm text-green-500">{message}</p>}
      {error && <p className="mt-6 rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

      {!message && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="password">New Password</label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <Input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to Log In
        </Link>
      </div>
    </>
  );
}
