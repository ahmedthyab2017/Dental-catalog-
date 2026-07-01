import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { AddSessionForm } from '@/components/patients/add-session-form';

export default function NewSessionPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AddSessionForm clinicId="" />
      </main>
    </ProtectedRoute>
  );
}
