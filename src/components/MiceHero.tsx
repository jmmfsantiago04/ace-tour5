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
        <section className="relative flex justify-center w-full min-h-[100vh] bg-white overflow-hidden">
            {/* Pattern Background */}
            <div className="absolute w-full h-auto aspect-[1282/380] left-1/2 -translate-x-1/2 overflow-hidden">
                <Image
                    src="/mice-solutions/mice-patternbg.png"
                    alt="Background pattern"
                    fill
                    className="object-contain"
                    sizes="100vw"
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

            <div className="relative w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
                <motion.div
                    ref={titleRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center justify-center w-full"
                >
                    {/* Title */}
                    <div className="w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[57.5rem] mb-8 sm:mb-12 md:mb-16 lg:mb-24">
                        <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold text-[#262626] leading-[1.3] sm:leading-[1.4] tracking-[0] text-center">
                            {t('title')}
                        </h1>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[1112px] mx-auto">
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
                                    className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6 p-4"
                                >
                                    <span className="gradient-text text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-bold leading-none">
                                        +<NumberTicker
                                            value={parseInt(card.title || '0')}
                                            duration={2000}
                                            delay={index * 200}
                                        />
                                    </span>
                                    {card.content && card.content.map((contentItem, i) => (
                                        <p key={i} className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium leading-[1.4] sm:leading-[1.5] md:leading-[1.6] lg:leading-[1.7] tracking-[0%] text-center text-[#475467] max-w-[280px] sm:max-w-[320px] lg:max-w-[348px]">
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