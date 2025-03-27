'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    lang: 'en' | 'ko';
}

export function Navbar({ lang }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const isLinkActive = (link: string) => {
        // Remove locale prefix from pathname (e.g., '/en' or '/ko')
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
        
        // Debug logging
        console.log('Current pathname:', pathname);
        console.log('Path without locale:', pathWithoutLocale);
        console.log('Link being checked:', link);
        
        if (link === '/') {
            const isHome = pathWithoutLocale === '/' || pathWithoutLocale === '';
            console.log('Is home page?', isHome);
            return isHome;
        }
        return pathWithoutLocale.startsWith(link);
    };

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

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
            { label: 'Support', link: '/support' }
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
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                        </div>
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

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex flex-1 justify-center">
                        <div className="flex space-x-8">
                            {navigation.menuItems.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="relative"
                                    ref={item.dropdownItems ? dropdownRef : null}
                                >
                                    {item.dropdownItems ? (
                                        <>
                                            <button
                                                className={`px-3 text-sm font-medium inline-flex items-center ${
                                                    isLinkActive(item.link)
                                                        ? 'text-[#1976D2]'
                                                        : 'text-gray-900 hover:text-gray-700'
                                                } ${isDropdownOpen ? 'text-[#1976D2]' : ''}`}
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            >
                                                {item.label}
                                                <svg
                                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${
                                                        isDropdownOpen || isLinkActive(item.link) ? 'rotate-180 text-[#1976D2]' : ''
                                                    }`}
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
                                                    className="absolute z-10 -left-2 w-48 py-1 mt-1 bg-white rounded-md shadow-lg border border-gray-100"
                                                >
                                                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                                        <Link
                                                            key={dropdownIndex}
                                                            href={dropdownItem.link}
                                                            prefetch={false}
                                                            className={`block px-4 py-2 text-sm ${
                                                                isLinkActive(dropdownItem.link)
                                                                    ? 'text-[#1976D2] bg-gray-50'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#1976D2]'
                                                            } transition-colors duration-150`}
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
                                            className={`px-3 py-2 text-sm font-medium ${
                                                isLinkActive(item.link)
                                                    ? 'text-[#1976D2]'
                                                    : 'text-gray-900 hover:text-gray-700'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu and Language Switcher Container */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(!isMobileMenuOpen);
                                    if (isMobileMenuOpen) {
                                        setActiveDropdown(null);
                                    }
                                }}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                                <svg
                                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    ref={mobileMenuRef}
                    className={`${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    } sm:hidden border-t border-gray-200`}
                >
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.menuItems.map((item, index) => (
                            <div key={index}>
                                {item.dropdownItems ? (
                                    <div>
                                        <button
                                            className={`w-full flex items-center justify-between px-4 py-2 text-base font-medium ${
                                                isLinkActive(item.link)
                                                    ? 'text-[#1976D2] bg-gray-50'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                            onClick={() => {
                                                setActiveDropdown(activeDropdown === index ? null : index);
                                            }}
                                        >
                                            {item.label}
                                            <svg
                                                className={`ml-2 w-4 h-4 transform transition-transform duration-200 ${
                                                    activeDropdown === index ? 'rotate-180' : ''
                                                } ${isLinkActive(item.link) ? 'text-[#1976D2]' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        {activeDropdown === index && (
                                            <div className="pl-4 space-y-1">
                                                {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                                    <Link
                                                        key={dropdownIndex}
                                                        href={dropdownItem.link}
                                                        prefetch={false}
                                                        className={`block px-4 py-2 text-base ${
                                                            isLinkActive(dropdownItem.link)
                                                                ? 'text-[#1976D2] bg-gray-50'
                                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                        onClick={() => {
                                                            setActiveDropdown(null);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        {dropdownItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.link}
                                        prefetch={false}
                                        className={`block px-4 py-2 text-base font-medium ${
                                            isLinkActive(item.link)
                                                ? 'text-[#1976D2] bg-gray-50'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
} 