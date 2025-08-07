// src/app/dashboard/upgrade/page.tsx

import { CheckCircle } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');
  
  // Fetch the user's current subscription status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true },
  });

  const isPremium = user?.subscriptionStatus === 'PREMIUM';

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Premium Subscription</h1>
      
      {isPremium ? (
        <div className="mt-8 max-w-2xl rounded-lg border border-green-500/50 bg-green-500/5 p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 font-heading text-2xl font-semibold">You are a Premium Member!</h2>
          <p className="mt-2 text-foreground/80">Thank you for your support. You can now feature your listings.</p>
        </div>
      ) : (
        <div className="mt-8 max-w-2xl">
          <p className="text-lg text-foreground/70">
            Upgrade to a Premium account to get the most out of the platform.
          </p>
          <div className="mt-6 rounded-lg border border-secondary bg-background p-6">
            <h2 className="font-heading text-xl font-semibold">Premium Benefits</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/80">
              <li>
                <span className="font-semibold text-foreground">Feature Your Listings:</span> Get your listings prioritized and highlighted on the main pages.
              </li>
              <li>
                <span className="font-semibold text-foreground">Priority Support:</span> Get faster responses to your inquiries.
              </li>
              <li>
                <span className="font-semibold text-foreground">Support the Platform:</span> Your contribution helps us maintain and improve the service for everyone.
              </li>
            </ul>
          </div>

          <div className="mt-8 rounded-lg border border-secondary bg-background p-6">
            <h2 className="font-heading text-xl font-semibold">How to Upgrade</h2>
            <p className="mt-4 text-foreground/80">
              To upgrade, please send a payment of [Your Price, e.g., 200,000 VND] for a one-year subscription using one of the methods below.
              After payment, please contact us with your transaction details and your account email. Your account will be upgraded manually within 24 hours.
            </p>
            <div className="mt-4 space-y-2">
              <p><span className="font-semibold">PayPal:</span> your-paypal-email@example.com</p>
              <p><span className="font-semibold">ZaloPay:</span> [Your ZaloPay Info/QR Code]</p>
              <p><span className="font-semibold">Bank Transfer:</span> [Your Bank Details]</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}