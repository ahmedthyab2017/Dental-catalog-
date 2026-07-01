export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🦷</div>
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Dental Clinic Manager</h1>
        <p className="text-xl text-gray-600 mb-8">
          نظام إدارة عيادات أسنان شامل مع معرض حالات احترافي
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            ابدأ مجاني الآن
          </a>
          <a
            href="/gallery"
            className="bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-bold transition"
          >
            عرض الحالات
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">المميزات الرئيسية</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📋', title: 'إدارة المرضى', desc: 'تسجيل وإدارة ملفات المرضى بسهولة' },
            { icon: '📅', title: 'الجلسات', desc: 'تتبع جلسات العلاج والمبالغ المدفوعة' },
            { icon: '📸', title: 'صور قبل وبعد', desc: 'معرض صور احترافي للحالات' },
            { icon: '🎨', title: 'التصاميم', desc: 'تصاميم جاهزة للوسائط الاجتماعية' },
            { icon: '💳', title: 'الفواتير', desc: 'إدارة الاشتراكات والدفعات' },
            { icon: '📊', title: 'التحليلات', desc: 'إحصائيات وتقارير شاملة' },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-xl mb-8 text-blue-100">
            انضم إلى العيادات التي تستخدم Dental Clinic Manager
          </p>
          <a
            href="/auth/signup"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition inline-block"
          >
            إنشاء حساب مجاني
          </a>
        </div>
      </section>
    </main>
  );
}
