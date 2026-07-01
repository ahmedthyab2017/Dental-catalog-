'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Clinic, Patient, Session } from '@/lib/types';

export function DashboardStats() {
  const { user } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [patientsCount, setPatientsCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get clinic
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setClinic(clinicData);

      if (clinicData) {
        // Get patients count
        const { count: pCount } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
          .eq('clinic_id', clinicData.id);

        setPatientsCount(pCount || 0);

        // Get sessions count and revenue
        const { data: sessionsData } = await supabase
          .from('sessions')
          .select('amount_paid')
          .eq('clinic_id', clinicData.id);

        setSessionsCount(sessionsData?.length || 0);
        const revenue = sessionsData?.reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0;
        setTotalRevenue(revenue);
      }
    } catch (err) {
      console.error('خطأ في جلب الإحصائيات:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'المرضى',
      value: patientsCount,
      icon: '👥',
      color: 'bg-blue-100',
    },
    {
      label: 'الجلسات',
      value: sessionsCount,
      icon: '📝',
      color: 'bg-green-100',
    },
    {
      label: 'الإيرادات',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-yellow-100',
    },
    {
      label: 'الخطة',
      value: clinic?.subscription_tier === 'pro' ? 'Pro' : 'Free',
      icon: '⭐',
      color: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={`${stat.color} rounded-lg p-6 shadow-md`}>
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-gray-600 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
