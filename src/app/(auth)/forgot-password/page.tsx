// src/app/(auth)/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.text();
    setMessage(data);
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Forgot Your Password?</h2>
        <p className="mt-2 text-sm text-foreground/70">
          No problem. Enter your email address below and we'll send you a link to reset it.
        </p>
      </div>

      {message ? (
        <p className="mt-6 rounded-md bg-green-500/10 p-3 text-sm text-green-500">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                'Send Reset Link'
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
