import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { DashboardStats } from '@/components/dashboard/stats';
import { PatientsList } from '@/components/dashboard/patients-list';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <DashboardStats />
          <PatientsList />
        </div>
      </main>
    </ProtectedRoute>
  );
}
