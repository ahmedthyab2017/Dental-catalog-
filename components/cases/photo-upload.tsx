'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export function PhotoUpload() {
  const params = useParams();
  const patientId = params.patientId as string;
  const caseId = params.caseId as string;
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isBefore, setIsBefore] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...photos, ...files].slice(0, 4); // Max 4 photos
    setPhotos(newPhotos);

    // Create previews
    newPhotos.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setError('');
    setUploading(true);

    try {
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const fileName = `${caseId}/${Date.now()}_${i}.jpg`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('photos').getPublicUrl(fileName);

        // Save to database
        const { error: insertError } = await supabase.from('photos').insert([
          {
            case_id: caseId,
            photo_url: publicUrl,
            is_before: isBefore,
            order_index: i,
          },
        ]);

        if (insertError) throw insertError;
      }

      // Reset form
      setPhotos([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'خطأ في رفع الصور');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">{isBefore ? '📸 الصور قبل' : '📷 الصور بعد'}</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Toggle Before/After */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setIsBefore(true)}
          className={`px-4 py-2 rounded-lg ${
            isBefore
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          قبل
        </button>
        <button
          onClick={() => setIsBefore(false)}
          className={`px-4 py-2 rounded-lg ${
            !isBefore
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          بعد
        </button>
      </div>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {photos.length}/4 صور
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={photos.length >= 4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`preview ${index}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || photos.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {uploading ? '📤 جاري الرفع...' : '⬆️ رفع الصور'}
      </button>
    </div>
  );
}
