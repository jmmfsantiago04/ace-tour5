'use client';

import { ShuttleHero } from '@/components/ShuttleHero';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { CardsShuttle } from '@/components/CardsShuttle';
import { SuccessDialog } from '@/components/SuccessDialog';

export default function ShuttleServicePage() {
  const t = useTranslations('ShuttleHero');
  const params = useParams();
  const isEnglish = params.locale === 'en';

  return (
    <main className="min-h-screen bg-white">
      <ShuttleHero />
      <CardsShuttle />
      <SuccessDialog />
    </main>
  );
} 