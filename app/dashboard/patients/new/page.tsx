import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { AddPatientForm } from '@/components/patients/add-patient-form';
import { supabase } from '@/lib/supabase';

async function getClinicId(userId: string) {
  const { data } = await supabase
    .from('clinics')
    .select('id')
    .eq('user_id', userId)
    .single();
  return data?.id;
}

export default function NewPatientPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AddPatientForm clinicId="" />
      </main>
    </ProtectedRoute>
  );
}
