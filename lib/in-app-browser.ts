'use client';

export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const signatures = [
    'FBAN', 'FBAV', 'FB_IAB',
    'Instagram', 'Snapchat',
    'TikTok', 'musical_ly', 'BytedanceWebview',
    'Line/', 'WhatsApp', 'Twitter',
    'MicroMessenger', 'GSA/',
  ];
  const isAndroidWebView = /\bwv\b/.test(ua) || /; wv\)/.test(ua);
  return isAndroidWebView || signatures.some((s) => ua.includes(s));
}

export function getMobileOS(): 'ios' | 'android' | 'other' {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

export async function openInSystemBrowser(url?: string): Promise<'opened' | 'copied' | 'failed'> {
  if (typeof window === 'undefined') return 'failed';
  const target = url || window.location.href;
  if (getMobileOS() === 'android') {
    try {
      const clean = target.replace(/^https?:\/\//, '');
      window.location.href =
        `intent://${clean}#Intent;scheme=https;package=com.android.chrome;end`;
      return 'opened';
    } catch {}
  }
  try {
    await navigator.clipboard.writeText(target);
    return 'copied';
  } catch {
    return 'failed';
  }
}
