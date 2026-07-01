import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { ProtectedRoute } from '@/components/protected-route';
import { PricingPlans } from '@/components/billing/pricing-plans';
import { BillingDashboard } from '@/components/billing/billing-dashboard';

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <BillingDashboard />
        <PricingPlans />
      </main>
    </ProtectedRoute>
  );
}
