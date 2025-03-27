import { MiceHero } from '@/components/MiceHero';
import { MiceCards } from '@/components/MiceCards';
import { getActiveMiceCards } from '@/app/actions/getMiceCards';

export default async function MiceSolutionsPage() {
  const { data: miceCards } = await getActiveMiceCards();

  return (
    <main className="min-h-screen">
      <MiceHero />
      <MiceCards cards={miceCards} />
    </main>
  );
} 