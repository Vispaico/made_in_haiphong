// src/app/dashboard/profile/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProfileForm from '@/components/dashboard/ProfileForm';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // If there's no session, redirect to login (should be handled by layout, but good practice)
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch the full, up-to-date user profile from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // This should not happen if a session exists, but it's a safe check
  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
      <p className="mt-2 text-lg text-foreground/70">View and update your profile information.</p>
      
      <div className="mt-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}