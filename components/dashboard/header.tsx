'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Clinic } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchClinic();
  }, [user]);

  const fetchClinic = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setClinic(data);
    } catch (err) {
      console.error('خطأ في جلب بيانات العيادة:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🦷 {clinic?.name || 'عيادتي'}</h1>
          <p className="text-blue-100 text-sm">{clinic?.subscription_tier === 'pro' ? '⭐ Pro' : '🆓 Free'}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}
