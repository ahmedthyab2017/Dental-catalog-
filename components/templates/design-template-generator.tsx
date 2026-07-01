'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '@/lib/supabase';

interface TemplateData {
  clinicName: string;
  treatmentType: string;
  beforePhoto: string;
  afterPhoto: string;
}

const templates = {
  instagram_post: {
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
  },
  instagram_story: {
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
  },
  facebook_post: {
    name: 'Facebook Post',
    width: 1200,
    height: 628,
  },
  tiktok: {
    name: 'TikTok',
    width: 1080,
    height: 1920,
  },
  before_after: {
    name: 'Before-After Slider',
    width: 800,
    height: 600,
  },
};

export function DesignTemplateGenerator({
  caseId,
  beforePhoto,
  afterPhoto,
  clinicName,
}: {
  caseId: string;
  beforePhoto: string;
  afterPhoto: string;
  clinicName: string;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('instagram_post');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const templateConfig = templates[selectedTemplate];

  const generateDesign = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: templateConfig.width,
        height: templateConfig.height,
        scale: 2,
      });

      const image = canvas.toDataURL('image/png');

      // Save to database
      const { error } = await supabase.from('generated_designs').insert([
        {
          case_id: caseId,
          template_id: selectedTemplate,
          design_url: image,
          platform: selectedTemplate.split('_')[0],
        },
      ]);

      if (error) throw error;

      // Trigger download
      const link = document.createElement('a');
      link.href = image;
      link.download = `design_${clinicName}_${selectedTemplate}.png`;
      link.click();
    } catch (err) {
      console.error('خطأ في إنشاء التصميم:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-2xl font-bold">🎨 منشئ التصاميم</h3>

      {/* Template Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">اختر القالب</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key as keyof typeof templates)}
              className={`p-3 rounded-lg border-2 transition text-center text-sm font-medium ${
                selectedTemplate === key
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
        <div
          ref={canvasRef}
          style={{
            width: `${templateConfig.width}px`,
            height: `${templateConfig.height}px`,
          }}
          className="bg-white mx-auto relative"
        >
          {/* Template Content */}
          {selectedTemplate.includes('instagram') || selectedTemplate === 'before_after' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
              <div className="flex gap-2 w-full">
                <img src={beforePhoto} alt="قبل" className="w-1/2 h-40 object-cover rounded" />
                <img src={afterPhoto} alt="بعد" className="w-1/2 h-40 object-cover rounded" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-600">{clinicName}</h2>
                <p className="text-gray-600 mt-2">تحولات ��ميلة ✨</p>
              </div>
            </div>
          ) : selectedTemplate === 'facebook_post' ? (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 p-4">
              <div className="text-center">
                <img
                  src={beforePhoto}
                  alt="قبل"
                  className="w-32 h-32 object-cover rounded mx-auto mb-4"
                />
                <p className="text-sm text-gray-600">قبل</p>
                <h2 className="text-xl font-bold text-blue-600 mt-2">{clinicName}</h2>
                <img
                  src={afterPhoto}
                  alt="بعد"
                  className="w-32 h-32 object-cover rounded mx-auto mt-4"
                />
                <p className="text-sm text-gray-600">بعد</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600">
              <img
                src={beforePhoto}
                alt="ق��ل"
                className="w-24 h-24 object-cover rounded-full border-4 border-white mb-4"
              />
              <h2 className="text-2xl font-bold text-white text-center mb-2">{clinicName}</h2>
              <img
                src={afterPhoto}
                alt="بعد"
                className="w-24 h-24 object-cover rounded-full border-4 border-white mt-4"
              />
              <p className="text-white text-center mt-4 text-sm">تحول رائع! ✨</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateDesign}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {isGenerating ? '⏳ جاري الإنشاء...' : '💾 حفظ وتنزيل التصميم'}
      </button>
    </div>
  );
}
