'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const transactionId = searchParams.get('transactionId');

    if (paymentStatus === 'success') {
      setMessage(`✅ تم الدفع بنجاح! معرف المعاملة: ${transactionId}`);
    } else if (paymentStatus === 'failed') {
      setMessage('❌ فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
    } else if (paymentStatus === 'error') {
      setMessage(`⚠️ حدث خطأ: ${searchParams.get('message')}`);
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="text-5xl mb-4">💳</div>
      <p className="text-lg font-bold text-gray-800">{message}</p>
      <div className="mt-6 space-y-2">
        <p className="text-gray-600">سيتم تحديث حسابك خلال بضع ثوان...</p>
        <a
          href="/dashboard"
          className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          العودة للوحة التحكم
        </a>
      </div>
    </div>
  );
}
