import { HomeHero } from '@/components/HomeHero';
import { OurMission } from '@/components/OurMission';
import { HowItWorks } from '@/components/HowItWorks';
import { UserStories } from '@/components/UserStories';
import { HomeEnd } from '@/components/HomeEnd';
import { Vector1 } from '@/components/Vector1';
import { Vector2 } from '@/components/Vector2';

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <Vector1/>
      <OurMission  />
      <Vector2/>
      <HowItWorks />
      <Vector2/>
      <UserStories />
      <HomeEnd />
    </main>
  );
} 