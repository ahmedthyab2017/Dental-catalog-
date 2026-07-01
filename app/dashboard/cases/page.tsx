import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';

export default function CasesPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">📸 الحالات</h2>
          <p className="text-gray-600">سيتم إضافة إدارة الحالات قريباً</p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
