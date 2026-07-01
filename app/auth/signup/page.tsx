import { SignupForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="text-6xl mb-2">🦷</div>
        <h1 className="text-4xl font-bold text-gray-800">Dental Clinic Manager</h1>
        <p className="text-gray-600 mt-2">ابدأ إدارة عيادتك اليوم</p>
      </div>
      <SignupForm />
    </div>
  );
}
