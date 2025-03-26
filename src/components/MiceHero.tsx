'use client';

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { NumberTicker } from '@/components/magicui/number-ticker';
import Image from 'next/image';

type Props = {
    id?: string;
};

export function MiceHero({ id }: Props) {
    const t = useTranslations('MiceHero');
    const params = useParams();
    const isEnglish = params.locale === 'en';

    const titleRef = useRef(null);
    const isTitleInView = useInView(titleRef, { once: true });

    const cards = [
        {
            title: t('cards.card1.title'),
            content: [{ text: t('cards.card1.content') }]
        },
        {
            title: t('cards.card2.title'),
            content: [{ text: t('cards.card2.content') }]
        },
        {
            title: t('cards.card3.title'),
            content: [{ text: t('cards.card3.content') }]
        }
    ];

    return (
        <section className="relative flex justify-center w-full min-h-[calc(100vh-5rem)] bg-white">
            {/* Pattern Background */}
            <div className="absolute w-full max-w-[1281.99px] aspect-[1282/380] left-1/2 -translate-x-1/2 overflow-hidden">
                <Image
                    src="/mice-solutions/mice-patternbg.png"
                    alt="Background pattern"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <style jsx>{`
                .gradient-text {
                    background: linear-gradient(179.24deg, rgba(163, 213, 255, 0.2) -17.36%, #1976D2 52.97%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>
            <div className="relative w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
                <motion.div
                    ref={titleRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center justify-center w-full"
                >
                    {/* Title */}
                    {isEnglish ? (
                        // English Title Layout
                        <div className="w-full max-w-[50.1875rem] mb-12 sm:mb-16 md:mb-20 lg:mb-24">
                            <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold text-[#262626] leading-[1.2] sm:leading-[1.3] md:leading-[1.3] lg:leading-[1.4] tracking-[0] text-center">
                                {t('title')}
                            </h1>
                        </div>
                    ) : (
                        // Korean Title Layout
                        <div className="w-full max-w-[57.5rem] mb-12 sm:mb-16 md:mb-20 lg:mb-24">
                            <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold text-[#262626] leading-[1.4] sm:leading-[1.4] md:leading-[1.4] lg:leading-[1.5] tracking-[0] text-center">
                                {t('title')}
                            </h1>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-[120px] w-full max-w-[348px] sm:max-w-[720px] lg:max-w-[1112px] mx-auto">
                        {cards.map((card, index) => {
                            const cardRef = useRef<HTMLDivElement | null>(null);
                            const isCardInView = useInView(cardRef, { once: true });

                            return (
                                <motion.div
                                    key={index}
                                    ref={cardRef}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6"
                                >
                                    <span className="gradient-text text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-bold leading-none">
                                        +<NumberTicker
                                            value={parseInt(card.title || '0')}
                                            duration={2000}
                                            delay={index * 200}
                                        />
                                    </span>
                                    {card.content && card.content.map((contentItem, i) => (
                                        <p key={i} className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium leading-[1.4] sm:leading-[1.5] md:leading-[1.6] lg:leading-[1.7] tracking-[0%] text-center align-middle text-[#475467] max-w-full sm:max-w-[280px] lg:max-w-[348px] px-4 sm:px-2 lg:px-0">
                                            {contentItem.text}
                                        </p>
                                    ))}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 