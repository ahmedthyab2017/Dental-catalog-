import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Clinic Manager | 🦷',
  description: 'Professional dental clinic management SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
