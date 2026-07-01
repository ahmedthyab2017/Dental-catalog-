'use client';

import { useState } from 'react';
import { PLANS } from '@/lib/pricing';
import { useAuth } from '@/lib/auth-context';

export function DualPaymentPlans() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'zain'>('zain'); // Default to Zain for Iraq

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    setLoading(planId);
    try {
      if (paymentMethod === 'zain') {
        // Zain Cash Payment
        const response = await fetch('/api/payments/zain-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.id}`,
          },
          body: JSON.stringify({ planId, billingCycle }),
        });

        const { redirectUrl } = await response.json();
        window.location.href = redirectUrl;
      } else {
        // Stripe Payment
        const response = await fetch('/api/payments/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.id}`,
          },
          body: JSON.stringify({ planId, billingCycle }),
        });

        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (err) {
      console.error('Error:', err);
      alert('خطأ في عملية الدفع');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎯 اختر خطتك</h2>
          <p className="text-gray-600 mb-6">ابدأ مجاني وارقى متى شئت</p>

          {/* Payment Method Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setPaymentMethod('zain')}
              className={`px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 ${
                paymentMethod === 'zain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="text-xl">🇮🇶</span> Zain Cash
            </button>
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 ${
                paymentMethod === 'stripe'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="text-xl">🌐</span> Stripe
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              شهري 📅
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-bold transition relative ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              سنوي 🎁
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                وفر 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                plan.id === 'pro'
                  ? 'ring-2 ring-blue-500 md:scale-105'
                  : 'bg-white'
              }`}
            >
              <div className={`p-6 ${
                plan.id === 'pro'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gray-50'
              }`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-4 ${
                  plan.id === 'pro' ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold">مجاني</span>
                  ) : paymentMethod === 'zain' ? (
                    <>
                      <span className="text-4xl font-bold">
                        {billingCycle === 'monthly'
                          ? (plan.price / 1000).toFixed(0)
                          : ((plan.priceAnnual || plan.price * 12) / 1000).toFixed(0)}
                      </span>
                      <span className={`text-sm ${
                        plan.id === 'pro' ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {' '}IQD /{billingCycle === 'monthly' ? 'شهر' : 'سنة'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">
                        ${(plan.price / 100).toFixed(2)}
                      </span>
                      <span className={`text-sm ${
                        plan.id === 'pro' ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        /{billingCycle === 'monthly' ? 'شهر' : 'سنة'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition mb-6 ${
                    plan.id === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {loading === plan.id ? '⏳ جاري...' : 'اختر الآن'}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
