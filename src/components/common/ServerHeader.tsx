// src/components/common/ServerHeader.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Header from './Header'; // This is your existing client-side Header

// This is a Server Component. It can safely call getServerSession.
export default async function ServerHeader() {
  // We fetch the session directly on the server.
  const session = await getServerSession(authOptions);

  // We then pass the session object as a prop to the client-side Header.
  return <Header session={session} />;
}