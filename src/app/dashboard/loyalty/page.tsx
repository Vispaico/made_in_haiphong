// src/app/dashboard/loyalty/page.tsx
import { Gem, Star, Gift, MessageSquare } from 'lucide-react';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-background rounded-xl border border-secondary p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-3">
      {icon}
      <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
    </div>
    <p className="text-foreground/70">{children}</p>
  </div>
);

export default function LoyaltyPage() {
  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto max-w-5xl py-12 md:py-16 px-4">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-500/10 p-4 rounded-full mb-4">
            <Gem className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Made in Haiphong Loyalty Program</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
            We value our community. Earn points for your contributions and unlock exclusive rewards.
          </p>
        </div>
        
        {/* --- How to Earn Section --- */}
        <div className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-8 text-foreground">How to Earn Points</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon={<Star className="h-8 w-8 text-yellow-500" />} title="Create & Engage">
              Earn points for creating new listings, making bookings, and participating in community discussions.
            </FeatureCard>
            <FeatureCard icon={<Gift className="h-8 w-8 text-accent" />} title="Unlock Rewards">
              Use your points for discounts on bookings, featured listings, and access to exclusive events.
            </FeatureCard>
            <FeatureCard icon={<MessageSquare className="h-8 w-8 text-primary" />} title="Stay Active">
              Keep an eye out for special promotions and bonus point opportunities to grow your balance even faster.
            </FeatureCard>
          </div>
        </div>

        {/* --- FAQ Section --- */}
        <div>
          <h2 className="font-heading text-3xl font-bold text-center mb-8 text-foreground">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-background rounded-xl border border-secondary p-6 shadow-sm">
              <h4 className="font-semibold text-lg text-foreground mb-2">Do my points expire?</h4>
              <p className="text-foreground/70">Never. Your loyalty points are yours to keep and do not have an expiration date. Accumulate them at your own pace.</p>
            </div>
            <div className="bg-background rounded-xl border border-secondary p-6 shadow-sm">
              <h4 className="font-semibold text-lg text-foreground mb-2">How can I check my balance?</h4>
              <p className="text-foreground/70">You can see your current Loyalty Balance at any time on your main dashboard page and in your profile settings.</p>
            </div>
             <div className="bg-background rounded-xl border border-secondary p-6 shadow-sm">
              <h4 className="font-semibold text-lg text-foreground mb-2">Are there other ways to earn points?</h4>
              <p className="text-foreground/70">Yes! We are constantly working on new ways to reward our community. We&rsquo;ll announce new earning opportunities through our newsletter and on-site announcements.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}