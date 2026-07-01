'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Clinic } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function ClinicSettings() {
  const { user } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchClinicData();
    }
  }, [user]);

  const fetchClinicData = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setClinic(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
      });
    } catch (err) {
      console.error('خطأ في جلب بيانات العيادة:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('clinics')
        .update(formData)
        .eq('id', clinic?.id);

      if (error) throw error;

      setMessage('✅ تم حفظ البيانات بنجاح');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('❌ خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">⚙️ إعدادات العيادة</h2>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('✅')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم العيادة *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المدينة
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          العنوان
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الدولة
        </label>
        <input
          type="text"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        {saving ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
      </button>
    </form>
  );
}
