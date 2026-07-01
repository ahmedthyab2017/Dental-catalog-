'use client';

import Link from 'next/link';

export function DashboardNav() {
  const menuItems = [
    { href: '/dashboard', label: '📊 لوحة التحكم', icon: '📊' },
    { href: '/dashboard/patients', label: '👥 المرضى', icon: '👥' },
    { href: '/dashboard/sessions', label: '📝 الجلسات', icon: '📝' },
    { href: '/dashboard/cases', label: '📸 الحالات', icon: '📸' },
    { href: '/dashboard/gallery', label: '🎨 المعرض', icon: '🎨' },
    { href: '/dashboard/settings', label: '⚙️ الإعدادات', icon: '⚙️' },
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
