'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export function AddSessionForm({ clinicId }: { clinicId: string }) {
  const params = useParams();
  const patientId = params.id as string;
  const [treatmentType, setTreatmentType] = useState('');
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountTotal, setAmountTotal] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'partial' | 'paid'>('pending');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const treatmentTypes = [
    'تنظيف أسنان',
    'حشو سن',
    'خلع سن',
    'تقويم أسنان',
    'زراعة أسنان',
    'تبييض أسنان',
    'علاج جذر',
    'فحص دوري',
    'أخرى',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('sessions').insert([
        {
          clinic_id: clinicId,
          patient_id: patientId,
          session_date: sessionDate,
          treatment_type: treatmentType,
          treatment_description: treatmentDescription,
          amount_total: parseFloat(amountTotal),
          amount_paid: parseFloat(amountPaid),
          payment_status: paymentStatus,
          notes,
        },
      ]);

      if (insertError) throw insertError;

      router.push(`/dashboard/patients/${patientId}`);
    } catch (err: any) {
      setError(err.message || 'خطأ في إضافة الجلسة');
    } finally {
      setLoading(false);
    }
  };

  // Update payment status based on amounts
  const handleAmountPaidChange = (value: string) => {
    setAmountPaid(value);
    if (amountTotal && parseFloat(value) > 0) {
      const paid = parseFloat(value);
      const total = parseFloat(amountTotal);
      if (paid >= total) {
        setPaymentStatus('paid');
      } else if (paid > 0) {
        setPaymentStatus('partial');
      } else {
        setPaymentStatus('pending');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">➕ إضافة جلسة علاج</h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع العلاج *
          </label>
          <select
            value={treatmentType}
            onChange={(e) => setTreatmentType(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر نوع العلاج</option>
            {treatmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تاريخ الجلسة *
          </label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          وصف العلاج
        </label>
        <textarea
          value={treatmentDescription}
          onChange={(e) => setTreatmentDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="تفاصيل العلاج..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المبلغ الكلي ($) *
          </label>
          <input
            type="number"
            value={amountTotal}
            onChange={(e) => setAmountTotal(e.target.value)}
            required
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المبلغ المدفوع ($)
          </label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => handleAmountPaidChange(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            حالة الدفع
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">معلق</option>
            <option value="partial">جزئي</option>
            <option value="paid">مدفوع</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات إضافية
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أي ملاحظات طبية أخرى..."
          rows={2}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'جاري الحفظ...' : '💾 حفظ الجلسة'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ⬅ رجوع
        </button>
      </div>
    </form>
  );
}
