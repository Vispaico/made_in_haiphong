// src/app/dashboard/loyalty/page.tsx
import { Gem } from 'lucide-react';

export default function LoyaltyPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Gem className="h-10 w-10 text-emerald-500" />
          <h1 className="font-heading text-4xl font-bold">Our Loyalty Program</h1>
        </div>
        
        <div className="prose prose-lg max-w-none rounded-xl border border-secondary bg-background p-8 shadow-sm">
          <p>
            Welcome to the Made in Haiphong Loyalty Program! We believe in rewarding our community members for their engagement and contributions. Our program is designed to be simple, transparent, and valuable.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold">How to Earn Points</h2>
          <p>
            You can earn Loyalty Points through various activities on our platform. Here are some of the ways you can accumulate points:
          </p>
          <ul>
            <li><strong>Creating Listings:</strong> Share your spaces and services with the community and earn points for each new listing.</li>
            <li><strong>Engaging with Posts:</strong> Like, comment, and participate in community discussions to earn rewards.</li>
            <li><strong>Making Bookings:</strong> Every booking you complete through our platform will add points to your balance.</li>
            <li><strong>Special Promotions:</strong> Keep an eye out for special events and promotions where you can earn bonus points!</li>
          </ul>

          <h2 className="font-heading text-2xl font-semibold">What Can You Do With Points?</h2>
          <p>
            Your Loyalty Points are more than just numbers; they unlock exclusive benefits and rewards. While we are still developing the full range of perks, you can look forward to:
          </p>
          <ul>
            <li>Discounts on future bookings.</li>
            <li>Featuring your listings more prominently.</li>
            <li>Access to exclusive community events and content.</li>
            <li>And much more to come!</li>
          </ul>

          <h2 className="font-heading text-2xl font-semibold">Frequently Asked Questions</h2>
          <p><strong>Do my points expire?</strong><br />
          No, your loyalty points do not expire. You can accumulate them over time and use them whenever you like.</p>
          <p><strong>How can I check my balance?</strong><br />
          You can always see your current Loyalty Balance on your main dashboard and in your profile settings.</p>

          <p className="mt-8 border-t border-secondary pt-4 text-center text-foreground/70">
            Thank you for being a valued member of the Made in Haiphong community. We're excited to grow with you!
          </p>
        </div>
      </div>
    </div>
  );
}