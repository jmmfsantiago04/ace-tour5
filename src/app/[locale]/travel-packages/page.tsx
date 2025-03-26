import { redirect } from 'next/navigation';

export default function TravelPackagesPage({ params }: { params: { locale: string } }) {
    redirect(`/${params.locale}/travel-packages/la-departure`);
    return null;
} 