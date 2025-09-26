// src/app/dashboard/listings/new/page.tsx
import ListingForm from '@/components/dashboard/ListingForm';

export default function NewListingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Create a New Listing</h1>
        <p className="mt-2 text-lg text-foreground/70">
          Follow the steps below to get your listing published on the marketplace.
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
