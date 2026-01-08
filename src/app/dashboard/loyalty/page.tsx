// src/app/dashboard/loyalty/page.tsx
import { Gem, Star, Gift, MessageSquare, ArrowUpRight } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-background rounded-xl border border-secondary p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-3">
      {icon}
      <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
    </div>
    <p className="text-foreground/70">{children}</p>
  </div>
);

export default async function LoyaltyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const [transactions, totalEarned] = await Promise.all([
    prisma.loyaltyTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.loyaltyTransaction.aggregate({
      where: { userId: session.user.id },
      _sum: { points: true },
    }),
  ]);

  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto max-w-5xl py-12 md:py-16 px-4 space-y-12">
        <div className="text-center">
          <div className="inline-block bg-emerald-500/10 p-4 rounded-full mb-4">
            <Gem className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Loyalty Overview</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
            Track how you earn TravelPoints across bookings, community contributions, and special drops.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-secondary bg-background p-6">
            <p className="text-sm text-foreground/60">Current balance</p>
            <p className="mt-2 text-4xl font-bold text-foreground">{session.user.loyaltyBalance ?? 0} pts</p>
            <p className="text-xs text-foreground/50 mt-1">Wallet syncing handles on-chain issuance automatically.</p>
          </div>
          <div className="rounded-2xl border border-secondary bg-background p-6">
            <p className="text-sm text-foreground/60">Lifetime earned</p>
            <p className="mt-2 text-4xl font-bold text-foreground">{totalEarned._sum.points ?? 0} pts</p>
            <p className="text-xs text-foreground/50 mt-1">Sum of every reward logged to your account.</p>
          </div>
          <div className="rounded-2xl border border-secondary bg-background p-6">
            <p className="text-sm text-foreground/60">Latest bonus</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {transactions[0] ? `${transactions[0].points} pts` : '—'}
            </p>
            <p className="text-xs text-foreground/50 mt-1">
              {transactions[0] ? `${transactions[0].reason}` : 'No activity yet'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary bg-background p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Activity</h2>
              <p className="text-sm text-foreground/60">Latest TravelPoints ledger entries</p>
            </div>
            <ArrowUpRight className="h-6 w-6 text-foreground/40" />
          </div>
          {transactions.length === 0 ? (
            <p className="text-foreground/60">No loyalty activity yet. Confirm a booking or join a promotion to get started.</p>
          ) : (
            <div className="divide-y divide-secondary">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col gap-1 py-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{tx.reason}</p>
                    <p className="text-xs text-foreground/50">
                      {formatDistanceToNow(tx.createdAt, { addSuffix: true })}
                      {tx.sourceType ? ` · ${tx.sourceType}` : ''}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">+{tx.points}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-heading text-3xl font-bold text-center mb-8 text-foreground">How to earn faster</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon={<Star className="h-8 w-8 text-yellow-500" />} title="Create & Engage">
              Earn points for creating new listings, booking unique stays, and sharing community tips.
            </FeatureCard>
            <FeatureCard icon={<Gift className="h-8 w-8 text-accent" />} title="Unlock Rewards">
              Redeem for featured placement, booking credits, and invite-only events.
            </FeatureCard>
            <FeatureCard icon={<MessageSquare className="h-8 w-8 text-primary" />} title="Stay Active">
              Watch announcements for flash bonuses and seasonal campaigns.
            </FeatureCard>
          </div>
        </div>
      </div>
    </div>
  );
}