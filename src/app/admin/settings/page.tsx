// src/app/admin/settings/page.tsx

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Admin Settings</h1>
      <p className="mt-2 text-lg text-foreground/70">Manage global settings for the application.</p>

      <div className="mt-8 max-w-2xl space-y-8">
        {/* Placeholder for managing site-wide announcements */}
        <div className="rounded-lg border border-secondary bg-background p-6">
          <h2 className="font-heading text-xl font-semibold">Site Announcements</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Create and manage site-wide announcements or banners.
          </p>
          <button className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50" disabled>
            Manage Announcements (Coming Soon)
          </button>
        </div>
        
        {/* Placeholder for managing categories */}
        <div className="rounded-lg border border-secondary bg-background p-6">
          <h2 className="font-heading text-xl font-semibold">Content Categories</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Manage the categories available in the Marketplace and Explore sections.
          </p>
          <button className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50" disabled>
            Manage Categories (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}