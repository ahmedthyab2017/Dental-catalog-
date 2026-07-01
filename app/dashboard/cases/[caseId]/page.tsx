import { ProtectedRoute } from '@/components/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardNav } from '@/components/dashboard/nav';
import { CasePhotosGallery } from '@/components/cases/case-photos-gallery';
import { PhotoUpload } from '@/components/cases/photo-upload';

export default function CaseDetailsPage() {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <DashboardNav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <PhotoUpload />
        <CasePhotosGallery />
      </main>
    </ProtectedRoute>
  );
}
