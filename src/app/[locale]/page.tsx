import { HomeHero } from '@/components/HomeHero';
import { OurMission } from '@/components/OurMission';
import { HowItWorks } from '@/components/HowItWorks';
import { UserStories } from '@/components/UserStories';
import { HomeEnd } from '@/components/HomeEnd';

export default function HomePage() {
  return (
    <main>
      <HomeHero imageSrc="/hero-image.jpg" />
      <OurMission imageSrc="/mission-image.jpg" />
      <HowItWorks imageSrc="/how-it-works-image.jpg" />
      <UserStories />
      <HomeEnd />
    </main>
  );
} 