'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface FAQ {
    id: string;
    titleEn: string;
    titleKo: string;
    contentEn: string;
    contentKo: string;
    category?: string;
}

interface SupportFAQProps {
    faqs?: FAQ[];
}

export function SupportFAQ({ faqs }: SupportFAQProps) {
    const t = useTranslations('SupportFAQ');
    const params = useParams();
    const isEnglish = params.locale === 'en';
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // If no FAQs are provided as props, use the default ones from translations
    const defaultCards = [
        {
            id: "1",
            titleEn: t('cards.card1.title'),
            titleKo: t('cards.card1.title'),
            contentEn: t('cards.card1.content'),
            contentKo: t('cards.card1.content')
        },
        {
            id: "2",
            titleEn: t('cards.card2.title'),
            titleKo: t('cards.card2.title'),
            contentEn: t('cards.card2.content'),
            contentKo: t('cards.card2.content')
        },
        {
            id: "3",
            titleEn: t('cards.card3.title'),
            titleKo: t('cards.card3.title'),
            contentEn: t('cards.card3.content'),
            contentKo: t('cards.card3.content')
        },
        {
            id: "4",
            titleEn: t('cards.card4.title'),
            titleKo: t('cards.card4.title'),
            contentEn: t('cards.card4.content'),
            contentKo: t('cards.card4.content')
        }
    ];

    // Limit to maximum 6 cards
    const displayCards = (faqs?.length ? faqs : defaultCards).slice(0, 6);

    return (
        <section className="relative flex justify-center w-full pt-[100px] min-h-screen">
            {/* Background pattern - limited height */}
            <div className="absolute inset-x-0 top-0 w-full h-[300px] sm:h-[400px] md:h-[648px] lg:h-[750px] overflow-hidden">
                <div className="absolute w-full h-full">
                    <Image
                        src="/support/support-patternbg.png"
                        alt="Background pattern"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="relative w-full max-w-7xl px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12 lg:py-16">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-4 sm:space-y-6 lg:space-y-8"
                >
                    <div className="inline-flex items-center justify-center w-full max-w-[16.5rem] min-h-[2.5rem] gap-2 rounded-[1.375rem] border border-[#F6B600] p-2 bg-[#FFF8F0]">
                        <span className="text-xs sm:text-sm font-medium text-[#F6B600] px-2">
                            {t('title')}
                        </span>
                    </div>
                    <div className={`mx-auto px-3 sm:px-4 lg:px-0 ${isEnglish
                        ? 'w-full lg:w-[60.875rem]'
                        : 'w-full md:w-[49.75rem]'
                        }`}>
                        <h2 className={`font-semibold text-center text-gray-900 ${isEnglish
                            ? 'text-xl sm:text-2xl lg:text-[3.25rem] leading-tight lg:leading-[1.1]'
                            : 'text-lg sm:text-2xl md:text-[2.5rem] leading-tight md:leading-[1.2]'
                            } tracking-[0] break-words`}>
                            {t('content')}
                        </h2>
                    </div>
                </motion.div>

                {/* FAQ Cards */}
                <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 max-w-[47.375rem] mx-auto mt-6 sm:mt-8 lg:mt-12">
                    {displayCards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="w-full"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full min-h-[3.5rem] xs:min-h-[4rem] sm:min-h-[5rem] py-[0.875rem] xs:py-[1rem] sm:py-[1.5rem] px-[0.75rem] xs:px-[1rem] bg-white rounded-[1rem] xs:rounded-[1.375rem] text-left hover:bg-gray-50 transition-colors border border-[#E5E7EB] gap-[0.75rem] xs:gap-[1.25rem]"
                            >
                                <span className="text-[0.875rem] xs:text-[1rem] font-medium leading-[1.4] xs:leading-[1.5] tracking-[0%] text-[#262626]">
                                    {isEnglish ? card.titleEn : card.titleKo}
                                </span>
                                <span className="flex-shrink-0">
                                    <motion.div
                                        className="flex items-center justify-center w-[1.75rem] h-[1.75rem] xs:w-[2rem] xs:h-[2rem] rounded-full bg-[#1976D2]"
                                    >
                                        <motion.svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            animate={{ rotate: openIndex === index ? 45 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path
                                                d="M5 2V8M2 5H8"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </motion.svg>
                                    </motion.div>
                                </span>
                            </button>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? 'auto' : 0,
                                    opacity: openIndex === index ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white border-x border-b border-[#E5E7EB] rounded-[1rem] xs:rounded-[1.375rem] mt-[-1px]">
                                    <div className="p-4 xs:p-6 mt-[15px] space-y-4">
                                        <p className="text-[0.8125rem] xs:text-[0.875rem] sm:text-[1rem] text-[#262626]/80 leading-[1.6]">
                                            {isEnglish ? card.contentEn : card.contentKo}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
} 