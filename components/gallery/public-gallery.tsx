'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Case as CaseType, Photo } from '@/lib/types';
import Link from 'next/link';

export function PublicGallery() {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [photos, setPhotos] = useState<{ [key: string]: Photo[] }>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPublicCases();
  }, []);

  const fetchPublicCases = async () => {
    try {
      // Get public cases
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (casesError) throw casesError;
      setCases(casesData || []);

      // Get photos for each case
      if (casesData && casesData.length > 0) {
        const caseIds = casesData.map((c) => c.id);
        const { data: photosData, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .in('case_id', caseIds);

        if (photosError) throw photosError;

        const photosByCase: { [key: string]: Photo[] } = {};
        photosData?.forEach((photo) => {
          if (!photosByCase[photo.case_id]) {
            photosByCase[photo.case_id] = [];
          }
          photosByCase[photo.case_id].push(photo);
        });
        setPhotos(photosByCase);
      }
    } catch (err) {
      console.error('خطأ في جلب الحالات العامة:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = filter === 'all' ? cases : cases.filter((c) => c.case_type === filter);

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🦷 معرض الحالات</h1>
        <p className="text-gray-600">اكتشف التحولات المذهلة في عالم طب الأسنان</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          الكل
        </button>
        {['orthodontics', 'implants', 'cosmetics', 'restorative', 'periodontics'].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          لا توجد حالات متاحة حالياً
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => {
            const casePhotos = photos[caseItem.id] || [];
            const beforePhoto = casePhotos.find((p) => p.is_before);
            const afterPhoto = casePhotos.find((p) => !p.is_before);

            return (
              <Link
                key={caseItem.id}
                href={`/gallery/${caseItem.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {beforePhoto && afterPhoto ? (
                    <div className="flex h-full">
                      <img
                        src={beforePhoto.photo_url}
                        alt="قبل"
                        className="w-1/2 h-full object-cover"
                      />
                      <img
                        src={afterPhoto.photo_url}
                        alt="بعد"
                        className="w-1/2 h-full object-cover"
                      />
                    </div>
                  ) : beforePhoto ? (
                    <img
                      src={beforePhoto.photo_url}
                      alt="الحالة"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📸 لا توجد صور
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition">
                    {caseItem.case_title || 'حالة بدون عنوان'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {caseItem.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>👀 {caseItem.views_count}</span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded capitalize">
                      {caseItem.case_type}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
