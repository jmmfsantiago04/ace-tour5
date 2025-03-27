import { Metadata } from "next";
import { SupportFAQ } from "@/components/SupportFAQ";
import { SupportHero } from "@/components/SupportHero";
import { SupportForm } from "@/components/SupportForm";
import { getActiveFAQs } from "@/app/actions/getFAQs";

export const metadata: Metadata = {
    title: 'Support | ACE Tour',
    description: 'Get help and support for your travel needs with ACE Tour.',
};

interface SupportPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function SupportPage({ params }: SupportPageProps) {
    const { locale } = await params;
    const { data: faqs } = await getActiveFAQs(locale);

    return (
        <main className="min-h-screen bg-[#A3D5FF]/30">
            <SupportHero />
            <SupportFAQ faqs={faqs} />
        </main>
    );
} 