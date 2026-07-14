'use client';

/**
 * كشف المتصفحات المضمّنة (WebView) داخل التطبيقات مثل
 * فيسبوك / إنستغرام / سناب شات / تيك توك / واتساب … إلخ.
 *
 * السبب: Google ترفض تدفّق OAuth داخل هذه البيئات وترجع الخطأ
 * 403 disallowed_useragent. لذلك نمنع محاولة الدخول أصلاً ونطلب
 * من المستخدم فتح الرابط في متصفح حقيقي.
 */
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';

  const signatures = [
    'FBAN', 'FBAV', 'FB_IAB',   // Facebook / Messenger
    'Instagram',
    'Snapchat',
    'TikTok', 'musical_ly', 'BytedanceWebview', // TikTok
    'Line/',
    'WhatsApp',
    'Twitter',
    'MicroMessenger',           // WeChat
    'GSA/',                     // تطبيق Google
  ];

  // علم WebView على أندرويد: "; wv)" داخل الـ UA
  const isAndroidWebView = /\bwv\b/.test(ua) || /; wv\)/.test(ua);

  return isAndroidWebView || signatures.some((s) => ua.includes(s));
}

/** نظام تشغيل الجهاز — لتخصيص التعليمات المعروضة للمستخدم. */
export function getMobileOS(): 'ios' | 'android' | 'other' {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

/**
 * محاولة فتح الرابط الحالي في متصفح النظام مباشرة.
 * على أندرويد نستخدم intent:// لفتح Chrome، وإلا ننسخ الرابط.
 */
export async function openInSystemBrowser(url?: string): Promise<'opened' | 'copied' | 'failed'> {
  if (typeof window === 'undefined') return 'failed';
  const target = url || window.location.href;

  // أندرويد: intent يفتح Chrome خارج الـ WebView
  if (getMobileOS() === 'android') {
    try {
      const clean = target.replace(/^https?:\/\//, '');
      window.location.href =
        `intent://${clean}#Intent;scheme=https;package=com.android.chrome;end`;
      return 'opened';
    } catch {
      /* يسقط للنسخ */
    }
  }

  // غير ذلك: انسخ الرابط ليلصقه المستخدم في متصفحه
  try {
    await navigator.clipboard.writeText(target);
    return 'copied';
  } catch {
    return 'failed';
  }
}
