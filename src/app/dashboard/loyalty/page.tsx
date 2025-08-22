// src/app/dashboard/loyalty/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Gem, Star, Gift, Award } from 'lucide-react';

// Placeholder data for transaction history
const transactionHistory = [
  { id: 1, date: '2025-08-22', description: 'Signed up for an account', points: 100 },
  { id: 2, date: '2025-08-21', description: 'Booked a stay at "Seaside Villa"', points: 50 },
  { id: 3, date: '2025-08-20', description: 'Wrote a review for "Bánh đa cua"', points: 25 },
  { id: 4, date: '2025-08-19', description: 'Redeemed points for a coffee voucher', points: -50 },
];

export default async function LoyaltyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-foreground">Loyalty Program</h1>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-lg font-bold text-primary">
          <Gem className="h-6 w-6" />
          <span>{user.loyaltyBalance ?? 0} Points</span>
        </div>
      </div>
      <p className="mt-2 text-lg text-foreground/70">Your loyalty is our greatest reward. Here’s how you can earn and use your points.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* How to Earn Points */}
        <div className="rounded-xl border border-secondary bg-background p-6">
          <h2 className="flex items-center font-heading text-2xl font-bold text-foreground">
            <Award className="mr-3 h-7 w-7 text-accent" />
            How to Earn Points
          </h2>
          <p className="mt-4 text-foreground/80">
            Earning points is simple. The more you engage with the Haiphong community, the more you earn.
          </p>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <Star className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
              <span><span className="font-semibold">Book Stays & Rentals:</span> Earn points for every booking you make.</span>
            </li>
            <li className="flex items-start">
              <Star className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
              <span><span className="font-semibold">Leave Reviews:</span> Share your experience and earn points for helpful reviews.</span>
            </li>
            <li className="flex items-start">
              <Star className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
              <span><span className="font-semibold">Participate in the Community:</span> Get rewarded for posting and interacting in the Community Feed.</span>
            </li>
          </ul>
        </div>

        {/* How to Use Points */}
        <div className="rounded-xl border border-secondary bg-background p-6">
          <h2 className="flex items-center font-heading text-2xl font-bold text-foreground">
            <Gift className="mr-3 h-7 w-7 text-emerald-500" />
            How to Use Points
          </h2>
          <p className="mt-4 text-foreground/80">
            Your points are valuable. Redeem them for exclusive discounts and perks.
          </p>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <Gift className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <span><span className="font-semibold">Discounts on Bookings:</span> Apply your points at checkout for a discount on your next stay or rental.</span>
            </li>
            <li className="flex items-start">
              <Gift className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <span><span className="font-semibold">Exclusive Vouchers:</span> Redeem points for vouchers at local restaurants and shops.</span>
            </li>
            <li className="flex items-start">
              <Gift className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <span><span className="font-semibold">Unlock Premium Features:</span> Use points to access special features on the platform (coming soon!).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">Recent Activity</h2>
        <div className="mt-4 rounded-xl border border-secondary bg-background">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary">
              <thead className="bg-secondary/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Description</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/80">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {transactionHistory.map((tx) => (
                  <tr key={tx.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/80">{tx.date}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{tx.description}</td>
                    <td className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${tx.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
