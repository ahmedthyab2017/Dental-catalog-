export const PLANS = [
  {
    id: 'free',
    name: 'الخطة المجانية',
    price: 0,
    description: 'للبدء',
    features: [
      '✅ تسجيل 5 مرضى',
      '✅ 4 صور قبل + 4 بعد لكل حالة',
      '❌ لا تصاميم مجانية',
      '❌ معرض عام محدود',
      '❌ دعم بريد إلكتروني',
    ],
    limits: {
      patients: 5,
      photos_per_case: 4,
      templates: 0,
    },
  },
  {
    id: 'pro',
    name: 'الخطة الاحترافية',
    price: 1500, // $15/month
    priceAnnual: 15000, // $150/year (save 17%)
    description: 'للعيادات النشطة',
    stripeId: 'price_1234567890',
    features: [
      '✅ تسجيل 100 مريض',
      '✅ صور غير محدودة',
      '✅ تصاميم غير محدودة',
      '✅ معرض عام كامل',
      '✅ أولويات بريد إلكتروني',
      '✅ تحليلات أساسية',
    ],
    limits: {
      patients: 100,
      photos_per_case: -1, // unlimited
      templates: -1,
    },
  },
  {
    id: 'enterprise',
    name: 'خطة المؤسسة',
    price: 4900, // $49/month
    priceAnnual: 49000, // $490/year
    description: 'للعيادات الكبيرة',
    stripeId: 'price_0987654321',
    features: [
      '✅ عيادات متعددة',
      '✅ موظفين غير محدودين',
      '✅ صور غير محدودة',
      '✅ تصاميم مخصصة',
      '✅ API Access',
      '✅ دعم VIP',
      '✅ تحليلات متقدمة',
      '✅ إدارة الفواتير',
    ],
    limits: {
      patients: -1,
      photos_per_case: -1,
      templates: -1,
    },
  },
];

export const getPlan = (planId: string) => PLANS.find((p) => p.id === planId);
