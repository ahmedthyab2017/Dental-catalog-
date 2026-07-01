import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { SessionsTimeline } from '@/components/patients/sessions-timeline';

export default function PatientDetailsPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SessionsTimeline />
      </main>
    </ProtectedRoute>
  );
}
