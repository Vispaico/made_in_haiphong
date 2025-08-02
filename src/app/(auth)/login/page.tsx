import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

// You can make this fallback more stylish if you want
function LoadingFallback() {
  return <div className="text-center text-foreground/70">Loading...</div>;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}