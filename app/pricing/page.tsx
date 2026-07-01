import { DualPaymentPlans } from '@/components/billing/dual-payment-plans';

export const metadata = {
  title: 'Pricing - Dental Clinic Manager',
  description: 'Choose your plan and start managing your clinic today',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <DualPaymentPlans />
    </main>
  );
}
