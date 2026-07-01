import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';

export default function GalleryPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🎨 المعرض</h2>
          <p className="text-gray-600">معرض الحالات الخاص بك يظهر هنا</p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
