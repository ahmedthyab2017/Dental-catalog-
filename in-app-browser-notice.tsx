'use client';

import { useState } from 'react';
import { getMobileOS, openInSystemBrowser } from '@/lib/in-app-browser';

export function InAppBrowserNotice({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const os = typeof window !== 'undefined' ? getMobileOS() : 'other';

  const handleOpen = async () => {
    const result = await openInSystemBrowser();
    if (result === 'copied') {
      setCopied(true);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="card !p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">🌐</div>

        <h2 className="font-display text-xl font-bold mb-2">
          افتح في المتصفح لإكمال الدخول
        </h2>

        <p className="text-ink-2/80 text-[15px] leading-7 mb-5">
          لا يسمح Google بتسجيل الدخول داخل التطبيق الذي فتحت منه الرابط.
          الرجاء فتح الصفحة في متصفح <span className="font-bold">Chrome</span> أو{' '}
          <span className="font-bold">Safari</span> ثم إكمال الدخول بحساب Google.
        </p>

        <div className="bg-teal/5 border border-teal/20 rounded-xl p-4 text-right text-[14px] leading-7 mb-5">
          {os === 'ios' ? (
            <>
              <p className="font-bold mb-1">على أجهزة آيفون:</p>
              اضغط أيقونة المشاركة{' '}
              <span className="inline-block">⬆️</span> في الأسفل، ثم اختر{' '}
              <span className="font-bold">«فتح في Safari»</span>.
            </>
          ) : (
            <>
              <p className="font-bold mb-1">على أجهزة أندرويد:</p>
              اضغط زر القائمة{' '}
              <span className="font-bold">⋮</span> في الأعلى، ثم اختر{' '}
              <span className="font-bold">«فتح في المتصفح»</span> أو{' '}
              <span className="font-bold">«فتح في Chrome»</span>.
            </>
          )}
        </div>

        <button onClick={handleOpen} className="btn-primary w-full !py-3 mb-3">
          {os === 'android' ? 'فتح في Chrome' : 'نسخ الرابط'}
        </button>

        {copied && (
          <p className="text-teal text-[13px] font-bold mb-3">
            ✅ تم نسخ الرابط — الصقه في متصفحك
          </p>
        )}

        <button
          onClick={onClose}
          className="text-ink-2/60 text-[13px] font-bold hover:text-ink-2 transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
