'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session } from '@/lib/types';
import Link from 'next/link';

export function SessionsTimeline() {
  const params = useParams();
  const patientId = params.id as string;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  useEffect(() => {
    if (patientId) {
      fetchSessions();
    }
  }, [patientId]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('patient_id', patientId)
        .order('session_date', { ascending: false });

      if (error) throw error;

      setSessions(data || []);

      // Calculate totals
      const paid = data?.reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0;
      const total = data?.reduce((sum, s) => sum + (s.amount_total || 0), 0) || 0;
      setTotalPaid(paid);
      setTotalRemaining(total - paid);
    } catch (err) {
      console.error('خطأ في جلب الجلسات:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📅 الخط الزمني للجلسات</h2>
        <Link
          href={`/dashboard/patients/${patientId}/sessions/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + جلسة جديدة
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded">
        <div>
          <div className="text-sm text-gray-600">إجمالي المبلغ</div>
          <div className="text-2xl font-bold text-gray-800">${(totalPaid + totalRemaining).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">المدفوع</div>
          <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">المتبقي</div>
          <div className="text-2xl font-bold text-red-600">${totalRemaining.toFixed(2)}</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">لا توجد جلسات بعد</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg">{session.treatment_type}</div>
                  <div className="text-sm text-gray-600">
                    📅 {new Date(session.session_date).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    session.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : session.payment_status === 'partial'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {session.payment_status === 'paid'
                    ? '✓ مدفوع'
                    : session.payment_status === 'partial'
                    ? '⚠ جزئي'
                    : '⏳ معلق'}
                </div>
              </div>

              {session.treatment_description && (
                <p className="text-gray-700 mb-3">{session.treatment_description}</p>
              )}

              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded mb-3">
                <div>
                  <div className="text-xs text-gray-600">المبلغ الكلي</div>
                  <div className="font-bold">${session.amount_total.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">المدفوع</div>
                  <div className="font-bold text-green-600">${session.amount_paid.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">المتبقي</div>
                  <div className="font-bold text-red-600">
                    ${(session.amount_total - session.amount_paid).toFixed(2)}
                  </div>
                </div>
              </div>

              {session.notes && <p className="text-sm text-gray-500 italic">📝 {session.notes}</p>}

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/dashboard/patients/${patientId}/sessions/${session.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  عرض
                </Link>
                <Link
                  href={`/dashboard/patients/${patientId}/sessions/${session.id}/edit`}
                  className="text-green-600 hover:underline text-sm"
                >
                  تعديل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
