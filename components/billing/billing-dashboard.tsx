'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Clinic, Subscription } from '@/lib/types';
import { getPlan } from '@/lib/pricing';

export function BillingDashboard() {
  const { user } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBillingInfo();
    }
  }, [user]);

  const fetchBillingInfo = async () => {
    try {
      // Get clinic
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setClinic(clinicData);

      if (clinicData) {
        // Get subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('clinic_id', clinicData.id)
          .single();

        setSubscription(subData);
      }
    } catch (err) {
      console.error('خطأ في جلب معلومات الفواتير:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  const currentPlan = getPlan(clinic?.subscription_tier || 'free');
  const daysRemaining = subscription
    ? Math.ceil(
        (new Date(subscription.current_period_end!).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">الخطة الحالية</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {currentPlan?.name}
            </div>
            <p className="text-gray-600 mb-4">{currentPlan?.description}</p>
            <div className="text-3xl font-bold mb-2">
              {currentPlan?.price === 0
                ? 'مجاني'
                : `$${(currentPlan?.price! / 100).toFixed(2)}/شهر`}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            {subscription && daysRemaining ? (
              <>
                <div className="text-sm text-gray-600 mb-2">الفترة المتبقية</div>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {daysRemaining} يوم
                </div>
                <p className="text-sm text-gray-600">
                  تاريخ التجديد:{' '}
                  {new Date(subscription.current_period_end!).toLocaleDateString('ar-SA')}
                </p>
              </>
            ) : (
              <p className="text-gray-600">لا توجد اشتراكات نشطة حالياً</p>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">المميزات المتاحة</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {currentPlan?.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-700">
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">سجل الدفعات</h3>
        <p className="text-gray-600 text-center py-8">
          سيظهر سجل دفعاتك هنا
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">
          🔄 تغيير الخطة
        </button>
        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition">
          ❌ إلغاء الاشتراك
        </button>
      </div>
    </div>
  );
}
