'use client';

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {
    id?: string;
};

export function CardsShuttle({ id }: Props) {
    const t = useTranslations('CardsShuttle');
    const params = useParams();
    const isEnglish = params.locale === 'en';

    const titleRef = useRef(null);
    const carouselRef = useRef(null);

    const isTitleInView = useInView(titleRef, { once: true });
    const isCarouselInView = useInView(carouselRef, { once: true });

    // Function to repeat array items until desired length
    const repeatToLength = <T,>(arr: T[], length: number): T[] => {
        const repeated = [...arr];
        while (repeated.length < length) {
            repeated.push(...arr.slice(0, length - repeated.length));
        }
        return repeated;
    };

    // Create image cards array
    const imageCards = [
        { media: { url: '/shuttle-service/shuttle-card-1.png', alt: 'Shuttle Service 1' } },
        { media: { url: '/shuttle-service/shuttle-card-2.png', alt: 'Shuttle Service 2' } },
        { media: { url: '/shuttle-service/shuttle-card-3.png', alt: 'Shuttle Service 3' } },
        { media: { url: '/shuttle-service/shuttle-card-4.png', alt: 'Shuttle Service 4' } }
    ];

    // Create feature cards array
    const featureCards = [
        {
            text: t('cards.card1.content'),
            media: { url: '/shuttle-service/icons/route.png.png', alt: 'Route Icon' }
        },
        {
            text: t('cards.card2.content'),
            media: { url: '/shuttle-service/icons/where.png.png', alt: 'Location Icon' }
        }
    ];

    // Calculate dimensions for animation
    const columnWidth = 1228; // Base width of one complete column set in pixels
    const totalWidth = columnWidth * 2; // Total width for two sets

    // Ensure we have at least 4 image cards and 2 feature cards
    const repeatedImageCards = repeatToLength(imageCards, 4);
    const repeatedFeatureCards = repeatToLength(featureCards, 2);

    return (
        <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 bg-white overflow-hidden w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Title */}
                    <motion.div
                        ref={titleRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                >

                    <h2 className="text-[24px] sm:text-[32px] md:text-[42px] lg:text-[48px] font-bold text-center mt-4 sm:mt-5 md:mt-6 text-[#1B365D]">
                            {t('title')}
                        </h2>
                    </motion.div>

                {/* Carousel Container */}
                <div className="overflow-hidden">
                    <motion.div
                        ref={carouselRef}
                        initial={{ x: 0 }}
                        animate={{ x: -columnWidth }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                        className="flex gap-4 sm:gap-6 lg:gap-8 w-fit"
                    >
                        {/* First Set of Columns */}
                        <div className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max">
                            {/* First Column - First Two Image Cards */}
                            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                                {repeatedImageCards.slice(0, 2).map((card, index) => {
                            const cardRef = useRef<HTMLDivElement | null>(null);
                            const isCardInView = useInView(cardRef, { once: true });

                            return (
                                <motion.div
                                    key={index}
                                    ref={cardRef}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                                            className={index === 0
                                                ? "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-lg group"
                                                : "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl overflow-hidden shadow-lg group"
                                            }
                                        >
                                            {card.media?.url && (
                                                <Image
                                                    src={card.media.url}
                                                    alt={card.media.alt}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Second Column - First Feature Card */}
                            <div className="flex flex-col justify-center">
                                {repeatedFeatureCards.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="relative w-[260px] sm:w-[280px] md:w-[307px] h-[360px] sm:h-[380px] md:h-[408px] rounded-2xl shadow-lg bg-[#1976D2] text-white overflow-hidden"
                                    >
                                        {/* Pattern Background */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src="/shuttle-service/shuttle-card-patternbg.png"
                                                alt="Pattern Background"
                                                fill
                                                className="object-cover opacity-70"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(32%) saturate(1492%) hue-rotate(182deg) brightness(94%) contrast(95%)' }}
                                            />
                                        </div>
                                        {repeatedFeatureCards[0].media?.url && (
                                            <div className="absolute bottom-[90px] sm:bottom-[100px] md:bottom-[108px] left-[17px] w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] z-10">
                                                <Image
                                                    src={repeatedFeatureCards[0].media.url}
                                                    alt={repeatedFeatureCards[0].media.alt}
                                                    width={45}
                                                    height={45}
                                                    className="object-contain brightness-0 invert"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute bottom-[17px] left-[17px] w-[230px] sm:w-[250px] md:w-[267px] h-[60px] sm:h-[66px] md:h-[72px] z-10">
                                            <p className={`${
                                                isEnglish 
                                                    ? 'text-[16px] font-medium leading-[24px] tracking-[0%]'
                                                    : 'text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%]'
                                            } text-left`}>
                                                {repeatedFeatureCards[0].text}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Third Column - Last Two Image Cards */}
                            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                                {repeatedImageCards.slice(2, 4).map((card, index) => {
                                    const cardRef = useRef<HTMLDivElement | null>(null);
                                    const isCardInView = useInView(cardRef, { once: true });

                                    return (
                                        <motion.div
                                            key={index + 2}
                                            ref={cardRef}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
                                            className={index === 0
                                                ? "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl overflow-hidden shadow-lg group"
                                                : "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl overflow-hidden shadow-lg group"
                                            }
                                        >
                                            {card.media?.url && (
                                                <Image
                                                    src={card.media.url}
                                                    alt={card.media.alt}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Fourth Column - Second Feature Card */}
                            <div className="flex flex-col justify-center">
                                {repeatedFeatureCards.length > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="relative w-[260px] sm:w-[280px] md:w-[307px] h-[360px] sm:h-[380px] md:h-[408px] rounded-2xl shadow-lg bg-[#FFC107] text-white overflow-hidden"
                                    >
                                        {/* Pattern Background */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src="/shuttle-service/shuttle-card-patternbg.png"
                                                alt="Pattern Background"
                                                fill
                                                className="object-cover"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(32%) saturate(1492%) hue-rotate(182deg) brightness(94%) contrast(95%)' }}
                                            />
                                        </div>
                                        {repeatedFeatureCards[1].media?.url && (
                                            <div className="absolute bottom-[90px] sm:bottom-[100px] md:bottom-[108px] left-[17px] w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] z-10">
                                                <Image
                                                    src={repeatedFeatureCards[1].media.url}
                                                    alt={repeatedFeatureCards[1].media.alt}
                                                    width={45}
                                                    height={45}
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute bottom-[17px] left-[17px] w-[230px] sm:w-[250px] md:w-[267px] h-[60px] sm:h-[66px] md:h-[72px] z-10">
                                            <p className={`${
                                                isEnglish 
                                                    ? 'text-[16px] font-medium leading-[24px] tracking-[0%]'
                                                    : 'text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%]'
                                            } text-left`}>
                                                {repeatedFeatureCards[1].text}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Duplicate Set - Same structure */}
                        <div className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max">
                            {/* First Column - First Two Image Cards */}
                            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                                {repeatedImageCards.slice(0, 2).map((card, index) => {
                                    const cardRef = useRef<HTMLDivElement | null>(null);
                                    const isCardInView = useInView(cardRef, { once: true });

                                    return (
                                        <motion.div
                                            key={`dup-${index}`}
                                            ref={cardRef}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                                            className={index === 0
                                                ? "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-lg group"
                                                : "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl overflow-hidden shadow-lg group"
                                            }
                                        >
                                            {card.media?.url && (
                                                <Image
                                                    src={card.media.url}
                                                    alt={card.media.alt}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Second Column - First Feature Card */}
                            <div className="flex flex-col justify-center">
                                {repeatedFeatureCards.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="relative w-[260px] sm:w-[280px] md:w-[307px] h-[360px] sm:h-[380px] md:h-[408px] rounded-2xl shadow-lg bg-[#1976D2] text-white overflow-hidden"
                                    >
                                        {/* Pattern Background */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src="/shuttle-service/shuttle-card-patternbg.png"
                                                alt="Pattern Background"
                                                fill
                                                className="object-cover opacity-70"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(32%) saturate(1492%) hue-rotate(182deg) brightness(94%) contrast(95%)' }}
                                            />
                                        </div>
                                        {repeatedFeatureCards[0].media?.url && (
                                            <div className="absolute bottom-[90px] sm:bottom-[100px] md:bottom-[108px] left-[17px] w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] z-10">
                                                <Image
                                                    src={repeatedFeatureCards[0].media.url}
                                                    alt={repeatedFeatureCards[0].media.alt}
                                                    width={45}
                                                    height={45}
                                                    className="object-contain brightness-0 invert"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute bottom-[17px] left-[17px] w-[230px] sm:w-[250px] md:w-[267px] h-[60px] sm:h-[66px] md:h-[72px] z-10">
                                            <p className={`${
                                                isEnglish 
                                                    ? 'text-[16px] font-medium leading-[24px] tracking-[0%]'
                                                    : 'text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%]'
                                            } text-left`}>
                                                {repeatedFeatureCards[0].text}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Third Column - Last Two Image Cards */}
                            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                                {repeatedImageCards.slice(2, 4).map((card, index) => {
                                    const cardRef = useRef<HTMLDivElement | null>(null);
                                    const isCardInView = useInView(cardRef, { once: true });

                                    return (
                                        <motion.div
                                            key={`dup-${index + 2}`}
                                            ref={cardRef}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
                                            className={index === 0
                                                ? "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl overflow-hidden shadow-lg group"
                                                : "relative w-[260px] sm:w-[280px] md:w-[307px] h-[240px] sm:h-[260px] md:h-[283px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl overflow-hidden shadow-lg group"
                                            }
                                        >
                                            {card.media?.url && (
                                                <Image
                                                    src={card.media.url}
                                                    alt={card.media.alt}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                </motion.div>
                            );
                        })}
                    </div>

                            {/* Fourth Column - Second Feature Card */}
                            <div className="flex flex-col justify-center">
                                {repeatedFeatureCards.length > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="relative w-[260px] sm:w-[280px] md:w-[307px] h-[360px] sm:h-[380px] md:h-[408px] rounded-2xl shadow-lg bg-[#FFC107] text-white overflow-hidden"
                                    >
                                        {/* Pattern Background */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src="/shuttle-service/shuttle-card-patternbg.png"
                                                alt="Pattern Background"
                                                fill
                                                className="object-cover opacity-30"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(32%) saturate(1492%) hue-rotate(182deg) brightness(94%) contrast(95%)' }}
                                            />
                                        </div>
                                        {repeatedFeatureCards[1].media?.url && (
                                            <div className="absolute bottom-[90px] sm:bottom-[100px] md:bottom-[108px] left-[17px] w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] z-10">
                                                <Image
                                                    src={repeatedFeatureCards[1].media.url}
                                                    alt={repeatedFeatureCards[1].media.alt}
                                                    width={45}
                                                    height={45}
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute bottom-[17px] left-[17px] w-[230px] sm:w-[250px] md:w-[267px] h-[60px] sm:h-[66px] md:h-[72px] z-10">
                                            <p className={`${
                                                isEnglish 
                                                    ? 'text-[16px] font-medium leading-[24px] tracking-[0%]'
                                                    : 'text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%]'
                                            } text-left`}>
                                                {repeatedFeatureCards[1].text}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 