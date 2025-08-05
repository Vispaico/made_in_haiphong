// src/app/dashboard/settings/page.tsx

import { Lock, Bell, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Settings</h1>
      <p className="mt-2 text-lg text-foreground/70">Manage your account and notification preferences.</p>

      <div className="mt-8 max-w-2xl space-y-8">
        {/* Change Password Section */}
        <div className="rounded-lg border border-secondary bg-background p-6">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-foreground/80" />
            <h2 className="font-heading text-xl font-semibold">Change Password</h2>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            For security, this will log you out of all other sessions.
          </p>
          <button className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50" disabled>
            Change Password (Coming Soon)
          </button>
        </div>
        
        {/* Notification Settings Section */}
        <div className="rounded-lg border border-secondary bg-background p-6">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-foreground/80" />
            <h2 className="font-heading text-xl font-semibold">Notifications</h2>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Manage your email and push notification settings.
          </p>
          <button className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50" disabled>
            Manage Notifications (Coming Soon)
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="rounded-lg border border-red-500/50 bg-red-500/5 p-6">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <h2 className="font-heading text-xl font-semibold text-red-500">Delete Account</h2>
          </div>
          <p className="mt-2 text-sm text-red-500/80">
            Permanently delete your account and all of your content. This action cannot be undone.
          </p>
          <button className="mt-4 rounded-md bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50" disabled>
            Delete Account (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}