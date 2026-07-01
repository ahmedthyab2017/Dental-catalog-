'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Patient } from '@/lib/types';
import Link from 'next/link';

export function PatientsList() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClinicAndPatients();
    }
  }, [user]);

  const fetchClinicAndPatients = async () => {
    try {
      // Get clinic ID
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (clinicData) {
        setClinicId(clinicData.id);

        // Get patients
        const { data: patientsData, error } = await supabase
          .from('patients')
          .select('*')
          .eq('clinic_id', clinicData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPatients(patientsData || []);
      }
    } catch (err) {
      console.error('خطأ في جلب المرضى:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👥 المرضى ({patients.length})</h2>
        <Link href="/dashboard/patients/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + إضافة مريض
        </Link>
      </div>

      {patients.length === 0 ? (
        <p className="text-center text-gray-500 py-8">لا توجد مرضى بعد. ابدأ بإضافة مريض!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-right">الاسم</th>
                <th className="px-4 py-2 text-right">البريد الإلكتروني</th>
                <th className="px-4 py-2 text-right">الهاتف</th>
                <th className="px-4 py-2 text-right">تاريخ الميلاد</th>
                <th className="px-4 py-2 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{patient.name}</td>
                  <td className="px-4 py-3">{patient.email || '-'}</td>
                  <td className="px-4 py-3">{patient.phone || '-'}</td>
                  <td className="px-4 py-3">{patient.date_of_birth || '-'}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Link
                      href={`/dashboard/patients/${patient.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      عرض
                    </Link>
                    <Link
                      href={`/dashboard/patients/${patient.id}/edit`}
                      className="text-green-600 hover:underline text-sm"
                    >
                      تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
