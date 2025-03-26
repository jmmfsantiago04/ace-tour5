'use client';

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {
    id?: string;
};

export function TravelPackages({ id }: Props) {
    const t = useTranslations('TravelPackages');
    const params = useParams();
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const headerRef = useRef(null);
    const cardRef = useRef(null);
    const mediaRef = useRef(null);
    const buttonsRef = useRef(null);

    const isHeaderInView = useInView(headerRef, { once: true });
    const isCardInView = useInView(cardRef, { once: true });
    const isMediaInView = useInView(mediaRef, { once: true });
    const isButtonsInView = useInView(buttonsRef, { once: true });

    const packages = [
        {
            title: t('package1.title'),
            price: t('package1.price'),
            content: [
                { text: t('package1.features.feature1') },
                { text: t('package1.features.feature2') },
                { text: t('package1.features.feature3') }
            ],
            imageAlt: t('package1.imageAlt'),
            mostPopular: true,
            button: {
                label: t('package1.button.label'),
                link: t('package1.button.link')
            }
        },
        {
            title: t('package2.title'),
            price: t('package2.price'),
            content: [
                { text: t('package2.features.feature1') },
                { text: t('package2.features.feature2') },
                { text: t('package2.features.feature3') }
            ],
            imageAlt: t('package2.imageAlt'),
            button: {
                label: t('package2.button.label'),
                link: t('package2.button.link')
            }
        },
        {
            title: t('package3.title'),
            price: t('package3.price'),
            content: [
                { text: t('package3.features.feature1') },
                { text: t('package3.features.feature2') },
                { text: t('package3.features.feature3') }
            ],
            imageAlt: t('package3.imageAlt'),
            button: {
                label: t('package3.button.label'),
                link: t('package3.button.link')
            }
        }
    ];

    const buttons = [
        {
            label: t('viewAllButton')
        }
    ];

    // Auto-rotate media every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            setCurrentMediaIndex((prev) => (prev + 1) % packages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, packages.length]);

    // Pause auto-rotation when hovering over the media section
    const handleMediaHover = (isHovering: boolean) => {
        setIsAutoPlaying(!isHovering);
    };

    // Function to handle package navigation
    const handleCardNavigation = (direction: 'prev' | 'next') => {
        if (!packages || packages.length === 0) return;

        if (direction === 'next') {
            setCurrentCardIndex((prev) => (prev + 1) % packages.length);
        } else {
            setCurrentCardIndex((prev) => (prev - 1 + packages.length) % packages.length);
        }
    };

    // Function to handle media navigation
    const handleMediaNavigation = (direction: 'prev' | 'next') => {
        if (!packages || packages.length === 0) return;

        if (direction === 'next') {
            setCurrentMediaIndex((prev) => (prev + 1) % packages.length);
        } else {
            setCurrentMediaIndex((prev) => (prev - 1 + packages.length) % packages.length);
        }
    };

    return (
        <section className="relative">
            <div className="absolute inset-x-0 top-0 w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[566px] bg-[#1976D2]" />
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 pt-[30px] sm:pt-[40px] md:pt-[50px]"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center justify-center w-[14rem] sm:w-[15rem] md:w-[16.5rem] h-[2rem] sm:h-[2.25rem] md:h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-[#F6B600] border-[1px] p-[0.5rem] mb-[10px] sm:mb-[12px] md:mb-[15px] bg-[#FFF8F0]">
                        <span className="text-xs sm:text-sm font-medium text-[#F6B600]">
                            {t('badge')}
                        </span>
                    </div>

                    <div className="w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto px-4 sm:px-0">
                        <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[36px] sm:leading-[40px] md:leading-[44px] lg:leading-[48px] tracking-[0px] font-semibold text-white text-center">
                            {t('title')}
                        </h2>
                    </div>

                    <p className="text-white/90 w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[26px] md:leading-[28px] tracking-[0%] font-medium text-center align-middle mt-[12px] sm:mt-[15px] md:mt-[18px]">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Card and Gallery Container */}
                <div className="flex flex-col lg:flex-row justify-center gap-[20px] sm:gap-[30px] lg:gap-[10px] items-center lg:items-start max-w-[1174px] mx-auto">
                    {/* Package Card */}
                    {packages && packages.length > 0 && packages[currentCardIndex] && (
                        <motion.div
                            key={currentCardIndex}
                            ref={cardRef}
                            initial={{ opacity: 0, x: 50 }}
                            animate={isCardInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="relative bg-white overflow-hidden w-full sm:w-[372px] h-auto sm:h-[484.89px] border border-gray-200 rounded-[20px] pt-[16px] pr-[24px] pb-[24px] pl-[24px] mb-4 lg:mb-0"
                        >
                            {/* Most Popular Banner */}
                            {packages[currentCardIndex].mostPopular && (
                                <div className="absolute top-0 left-0 right-0 bg-[#FFC107] text-center py-2 sm:py-3 text-white text-sm sm:text-base font-medium">
                                    {params.locale === 'ko' ? '인기 상품' : 'Most popular'}
                                </div>
                            )}

                            {/* Card Content */}
                            <div className={`${packages[currentCardIndex].mostPopular ? 'pt-[30px] sm:pt-[36px]' : ''}`}>
                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl font-bold text-[#1B365D] mb-3 sm:mb-4">
                                    {packages[currentCardIndex].title}
                                </h3>

                                {/* Starting Price */}
                                <div className="flex items-center gap-2 mb-[30px] sm:mb-[50px]">
                                    <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0%] font-medium text-gray-600">
                                        Starting at
                                    </span>
                                    <div className="inline-flex w-[100px] sm:w-[122px] h-[36px] sm:h-[40px] items-center justify-center rounded-[22px] bg-[#1B365D] p-[8px] gap-[8px]">
                                        <span className="text-lg sm:text-xl font-bold text-white">{packages[currentCardIndex].price}</span>
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-[30px] sm:space-y-[50px] mb-[35px] sm:mb-[55px]">
                                    {packages[currentCardIndex]?.content?.map((item, i, array) => (
                                        <div key={i} className="relative">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1B365D] flex items-center justify-center mr-2 sm:mr-3">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-600 text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0%] font-normal">
                                                    {item.text}
                                                </p>
                                            </div>
                                            {i < (array.length - 1) && (
                                                <div className="absolute w-full h-[1px] bg-[#F5F5F5] transform rotate-[-0.17deg] left-0 top-[30px] sm:top-[50px]" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Book Now Button */}
                                {packages[currentCardIndex].button && (
                                    <Link
                                        href={packages[currentCardIndex].button.link}
                                        className="group inline-flex w-full sm:w-[324px] h-[44px] sm:h-[48px] items-center justify-between rounded-[22px] bg-[#1976D2] hover:bg-[#1565C0] pt-[8px] pr-[4px] pb-[8px] pl-[16px] sm:pl-[20px] text-white transition-all"
                                    >
                                        <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0%] font-medium">
                                            {packages[currentCardIndex].button.label}
                                        </span>
                                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[10px] bg-white">
                                            <svg
                                                className="h-4 w-4 sm:h-5 sm:w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H6.66665M14.1666 5.83334V13.3333"
                                                    stroke="currentColor"
                                                    strokeWidth="1.67"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Media Section */}
                    <motion.div
                        ref={mediaRef}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isMediaInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full sm:w-[500px] md:w-[600px] lg:w-[782px] h-[300px] sm:h-[400px] md:h-[484.89px] rounded-[20px] overflow-hidden"
                        onMouseEnter={() => handleMediaHover(true)}
                        onMouseLeave={() => handleMediaHover(false)}
                    >
                        {/* Gallery Images */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            key={currentMediaIndex}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={[
                                    '/travel-packages/palm-trees-la.png',
                                    '/travel-packages/grand-canyon.png',
                                    '/travel-packages/city-night-la.png'
                                ][currentMediaIndex]}
                                alt={packages[currentMediaIndex].imageAlt}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        {/* Navigation Buttons */}
                        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-[8px] sm:gap-[10px]">
                            <button
                                onClick={() => handleMediaNavigation('prev')}
                                className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-[8px] p-[10px] sm:p-[12px] bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667"
                                        stroke="#1976D2"
                                        strokeWidth="1.67"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleMediaNavigation('next')}
                                className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-[8px] p-[10px] sm:p-[12px] bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333"
                                        stroke="#1976D2"
                                        strokeWidth="1.67"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Buttons Section */}
                {buttons && buttons.length > 0 && (
                    <motion.div
                        ref={buttonsRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isButtonsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full max-w-[1174px] mx-auto mt-6 lg:mt-5"
                    >
                        <div className="w-full flex justify-center lg:justify-end">
                            {buttons.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCardNavigation('next')}
                                    className="w-[160px] sm:w-[180px] md:w-[203px] h-[36px] sm:h-[38px] md:h-[40px] flex items-center justify-center rounded-[20px] border border-[#1976D2] pt-[8px] pr-[16px] sm:pr-[18px] md:pr-[20px] pb-[8px] pl-[16px] sm:pl-[18px] md:pl-[20px] bg-white text-[#1976D2] hover:bg-white/90 transition-colors duration-300"
                                >
                                    <span className="text-[14px] sm:text-[15px] md:text-[16px] leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%] font-medium">{button.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Navigation Arrows */}
                {packages && packages.length > 1 && (
                    <div className="flex justify-center mt-[20px] sm:mt-[25px] md:mt-[30px] gap-2 mb-6 sm:mb-7 md:mb-8">
                        <button
                            onClick={() => handleCardNavigation('prev')}
                            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleCardNavigation('next')}
                            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
} 