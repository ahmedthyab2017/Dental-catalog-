import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { ClinicSettings } from '@/components/settings/clinic-settings';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ClinicSettings />
      </main>
    </ProtectedRoute>
  );
}
