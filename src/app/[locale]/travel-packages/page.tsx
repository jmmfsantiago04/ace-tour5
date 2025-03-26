'use client';

import { TravelPackages } from '@/components/TravelPackages';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function TravelPackagesPage() {
  const t = useTranslations('TravelPackages');
  const params = useParams();
  const isEnglish = params.locale === 'en';

  return (
    <main className="min-h-screen bg-white">
      <TravelPackages />
    </main>
  );
} 