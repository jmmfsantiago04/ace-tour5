'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
    lang: 'en' | 'ko';
}

export function Navbar({ lang }: NavbarProps) {
    const navigation = {
        logo: {
            url: '/logo.png',
            alt: 'ACE Tour Logo'
        },
        menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Travel Packages', link: '/travel-packages' },
            { label: 'Shuttle Service', link: '/shuttle-service' },
            { label: 'MICE Solutions', link: '/mice-solutions' },
            { label: 'Contact', link: '/contact' }
        ]
    };

    if (!navigation?.logo || !navigation?.menuItems) {
        return (
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold">ACE Tour</span>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>
        );
    }

    if (!navigation.logo.url) {
        return null;
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" prefetch={false}>
                            <Image
                                src={navigation.logo.url}
                                alt={navigation.logo.alt || 'Logo'}
                                width={150}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="hidden sm:flex sm:space-x-8">
                            {navigation.menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    prefetch={false}
                                    className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
} 