'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { MiceHero } from '@/components/MiceHero';

export default function MiceSolutionsPage() {
  const t = useTranslations('MiceHero');    
  const params = useParams();
  const isEnglish = params.locale === 'en';

  return (
    <main className="min-h-screen bg-white">
        <MiceHero />
    </main>
  );
} 