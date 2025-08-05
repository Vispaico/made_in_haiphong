// src/app/admin/users/page.tsx

import prisma from '@/lib/prisma';
import Image from 'next/image';
import { BadgeCheck, ShieldAlert } from 'lucide-react';
import AdminUserActions from '@/components/admin/AdminUserActions'; // Import the new component

export default async function AdminManageUsersPage() {
  const allUsers = await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage All Users</h1>
      <p className="mt-2 text-lg text-foreground/70">View and manage all registered users on the platform.</p>
      
      <div className="mt-8 overflow-x-auto rounded-lg border border-secondary bg-background">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Role</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {allUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Image src={user.image || '/images/avatar-default.png'} alt={user.name || 'User'} width={40} height={40} className="rounded-full" />
                    <div className="font-semibold">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-500">
                      <ShieldAlert className="h-4 w-4" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-700">
                      <BadgeCheck className="h-4 w-4" />
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* THE FIX: Render the action buttons for the user */}
                  <AdminUserActions user={{ id: user.id, isAdmin: user.isAdmin }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}