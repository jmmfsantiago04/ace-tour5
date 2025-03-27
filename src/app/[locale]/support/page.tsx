import { Metadata } from "next";
import { SupportFAQ } from "@/components/SupportFAQ";
import { SupportHero } from "@/components/SupportHero";
import { SupportForm } from "@/components/SupportForm";
export const metadata: Metadata = {
    title: 'Support | ACE Tour',
    description: 'Get help and support for your travel needs with ACE Tour.',
};

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-[#A3D5FF]/30">
            <SupportHero/>
        
            <SupportFAQ  />
        </main>
    );
} 