'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleIcon } from './google-button';
import { InAppBrowserNotice } from './in-app-browser-notice';
import { isInAppBrowser } from '@/lib/in-app-browser';
import { IN_APP_BROWSER_ERROR } from '@/lib/auth-context';

export function SignupForm() {
  const [clinicName, setClinicName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [error, setError] = useState('');
  const [showBrowserNotice, setShowBrowserNotice] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    if (isInAppBrowser()) {
      setShowBrowserNotice(true);
      return;
    }
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.message === IN_APP_BROWSER_ERROR) {
        setShowBrowserNotice(true);
        return;
      }
      setError(err.message || 'تعذّر إنشاء الحساب عبر Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('كلمتا المرور غير متطابقتين'); return; }
    if (password.length < 6) { setError('كلمة المرور 6 أحرف على الأقل'); return; }
    setLoading(true);
    try {
      await signUp(email, password, clinicName);
      router.push('/auth/confirmation');
    } catch (err: any) {
      setError(err.message || 'تعذّر إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card !p-8">
      {showBrowserNotice && (
        <InAppBrowserNotice onClose={() => setShowBrowserNotice(false)} />
      )}
      <h1 className="font-display text-2xl font-bold mb-1 text-center">أنشئ استوديو عيادتك</h1>
      <p className="text-center text-ink-2/70 text-sm mb-7">مجاني للبدء — بدون بطاقة ائتمان</p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button onClick={handleGoogleSignIn} className="btn-primary w-full !py-3.5 text-base">
        <GoogleIcon />
        التسجيل بحساب Google
      </button>
      <p className="mt-3 text-center text-ink-2/50 text-xs">أسرع طريقة — بنقرة واحدة وبدون كلمة مرور</p>

      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line" /></div>
        <div className="relative flex justify-center">
          <button
            type="button"
            onClick={() => setShowEmail((v) => !v)}
            className="px-3 bg-white text-ink-2/60 text-xs font-bold hover:text-teal transition"
          >
            {showEmail ? 'إخفاء التسجيل بالبريد' : 'أو التسجيل بالبريد الإلكتروني'}
          </button>
        </div>
      </div>

      {showEmail && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5">اسم العيادة</label>
            <input type="text" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required placeholder="عيادة الابتسامة" />
          </div>
          <div>
            <label className="block mb-1.5">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" dir="ltr" />
          </div>
          <div>
            <label className="block mb-1.5">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" dir="ltr" />
          </div>
          <div>
            <label className="block mb-1.5">تأكيد كلمة المرور</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" dir="ltr" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
            {loading ? 'جاري الإنشاء…' : 'إنشاء الحساب'}
          </button>
        </form>
      )}

      <p className="mt-7 text-center text-ink-2/70 text-sm">
        عندك حساب؟{' '}
        <Link href="/auth/login" className="text-teal font-bold hover:underline">سجّل دخولك</Link>
      </p>
    </div>
  );
}
