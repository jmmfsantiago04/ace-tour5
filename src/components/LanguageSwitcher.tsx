'use client';

import { useParams, usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export function LanguageSwitcher() {
    const params = useParams();
    const pathname = usePathname();
    const currentLocale = params.locale as string;
    const isEnglish = currentLocale === 'en';

    // Get the path without the locale
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');

    return (
        <div className="flex items-center space-x-2">
            <Link
                href={`${pathWithoutLocale}`}
                locale={isEnglish ? 'ko' : 'en'}
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
            >
                <span className="text-sm font-medium text-gray-900">
                    {isEnglish ? 'ENG' : '한국어'}
                </span>
                <Image
                    src={isEnglish ? '/flags/uk.png' : '/flags/kr.png'}
                    alt={isEnglish ? 'English' : '한국어'}
                    width={20}
                    height={15}
                    className="w-5 h-auto"
                />
            </Link>
        </div>
    );
} 