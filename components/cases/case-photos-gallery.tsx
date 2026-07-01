'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Photo, Case as CaseType } from '@/lib/types';
import Image from 'next/image';

export function CasePhotosGallery() {
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<CaseType | null>(null);
  const [beforePhotos, setBeforePhotos] = useState<Photo[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchCaseAndPhotos();
    }
  }, [caseId]);

  const fetchCaseAndPhotos = async () => {
    try {
      // Get case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;
      setCaseData(caseData);

      // Get photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('case_id', caseId)
        .order('order_index', { ascending: true });

      if (photosError) throw photosError;

      const before = photosData?.filter((p) => p.is_before) || [];
      const after = photosData?.filter((p) => !p.is_before) || [];
      setBeforePhotos(before);
      setAfterPhotos(after);
    } catch (err) {
      console.error('خطأ في جلب الحالة والصور:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Before Photos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4">📸 قبل العلاج ({beforePhotos.length})</h3>
        {beforePhotos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد صور قبل</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {beforePhotos.map((photo, index) => (
              <div key={photo.id} className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={photo.photo_url}
                  alt={`قبل ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* After Photos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4">📷 بعد العلاج ({afterPhotos.length})</h3>
        {afterPhotos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد صور بعد</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {afterPhotos.map((photo, index) => (
              <div key={photo.id} className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={photo.photo_url}
                  alt={`بعد ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
