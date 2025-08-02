// src/app/(auth)/signup/page.tsx

import Link from 'next/link';

export default function SignUpPage() {
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

      <form className="mt-8 space-y-6">
        {/* We will add social logins and more fields later */}
        <div className="space-y-2">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"
            />
        </div>

        <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"
            />
        </div>
        
        <div>
          <button type="submit" className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition-colors hover:bg-accent/90">
            Create Account
          </button>
        </div>
      </form>
    </>
  );
}