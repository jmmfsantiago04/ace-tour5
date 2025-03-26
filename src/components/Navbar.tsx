'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
    lang: 'en' | 'ko';
}

export function Navbar({ lang }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigation = {
        logo: {
            url: '/logo.png',
            alt: 'ACE Tour Logo'
        },
        menuItems: [
            { label: 'Home', link: '/' },
            { 
                label: 'Travel Packages', 
                link: '/travel-packages',
                dropdownItems: [
                    { label: 'LA Departure', link: '/travel-packages/la-departure' },
                    { label: 'Las Vegas Departure', link: '/travel-packages/las-vegas-departure' },
                    { label: 'Semi-Package', link: '/travel-packages/semi-package' }
                ]
            },
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
                                <div 
                                    key={index} 
                                    className="relative"
                                    ref={item.dropdownItems ? dropdownRef : null}
                                >
                                    {item.dropdownItems ? (
                                        <>
                                            <button
                                                className={`text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium inline-flex items-center ${isDropdownOpen ? 'text-blue-600' : ''}`}
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            >
                                                {item.label}
                                                <svg
                                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                            {isDropdownOpen && (
                                                <div 
                                                    className="absolute z-10 w-48 py-2 mt-1 bg-white rounded-md shadow-lg border border-gray-100"
                                                >
                                                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                                        <Link
                                                            key={dropdownIndex}
                                                            href={dropdownItem.link}
                                                            prefetch={false}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        >
                                                            {dropdownItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.link}
                                            prefetch={false}
                                            className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
} 