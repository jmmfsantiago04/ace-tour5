'use client';

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { BookingForm } from './BookingForm';

type Props = {
    id?: string;
};

export function ShuttleHero({ id }: Props) {
    const t = useTranslations('ShuttleHero');
    const params = useParams();
    const isEnglish = params.locale === 'en';

    const titleRef = useRef(null);
    const isTitleInView = useInView(titleRef, { once: true });

    const featureCards = [
        {
            icon: '/shuttle-service/icons/clock-shuttle.png',
            text: t('features.feature1')
        },
        {
            icon: '/shuttle-service/icons/bus-shuttle.png',
            text: t('features.feature2')
        }
    ];

    return (
        <section className="relative w-full min-h-screen bg-white py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-[1200px] mx-auto">
                    {/* Left Content */}
                    <div className="w-full lg:w-auto max-w-[461px] flex-shrink-0">
                        <motion.div
                            ref={titleRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6 }}
                            className={`px-4 sm:px-5 md:pl-[16px] pt-4 sm:pt-5 md:pt-[16px] rounded-[20px] border border-[#E5E5E5] bg-[#F0F7FE] overflow-hidden ${
                                isEnglish
                                    ? 'h-auto md:h-[368px]'
                                    : 'h-auto md:h-[305px]'
                            }`}
                        >
                            {/* Badge */}
                            <div className={`${
                                isEnglish
                                    ? 'w-full sm:w-[265px]'
                                    : 'w-fit'
                            } px-6 sm:px-8 md:px-[35px] py-2 sm:py-3 md:py-[10px] rounded-full border border-[#F6B600] bg-[#F6B600]/10`}>
                                <div className="flex justify-center items-center">
                                    <span className="text-[14px] sm:text-[15px] md:text-[16px] text-center font-medium text-[#F6B600]">
                                        {t('badge')}
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="w-full sm:w-[90%] md:max-w-[428px]">
                                <h2 className={`text-[24px] sm:text-[28px] md:text-[32px] lg:text-[50px] font-bold ${
                                    isEnglish 
                                        ? 'mt-[15px] mb-[50px]'
                                        : 'mt-[10px] mb-[40px]'
                                }`}>
                                    {t('title')}
                                </h2>
                            </div>
                            <div className="w-full sm:w-[90%] md:w-[408px] h-auto md:h-[94px]">
                                <p className={`${
                                    isEnglish 
                                        ? 'text-left font-medium text-[13px] sm:text-[14px] md:text-[15px] leading-[20px] sm:leading-[22px] md:leading-[24px] mb-[35px]' 
                                        : 'text-left font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%] align-middle mb-[50px]'
                                }`}>
                                    {isEnglish ? (
                                        t('description').split('!').map((text, index, array) => (
                                            <React.Fragment key={index}>
                                                {text}
                                                {index < array.length - 1 && (
                                                    <>{`!`}<br /></>
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        t('description').split(/(?<=[!.])/).map((text, index, array) => (
                                            <React.Fragment key={index}>
                                                {text}
                                                {index < array.length - 1 && (
                                                    <br />
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </p>
                            </div>
                        </motion.div>

                        {/* Feature Cards */}
                        <div className="mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-4 md:space-y-5">
                            {featureCards.map((card, index) => {
                                const cardRef = useRef<HTMLDivElement | null>(null);
                                const isCardInView = useInView(cardRef, { once: true });

                                return (
                                    <motion.div
                                        key={index}
                                        ref={cardRef}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.6, delay: 0.1 * index }}
                                        className="flex items-center h-[60px] sm:h-[70px] md:h-[80px] gap-3 sm:gap-4 md:gap-5 rounded-[22px] border px-3 sm:px-4 py-4 sm:py-5 md:py-6 bg-white border-[#E5E5E5] hover:border-[#0066FF] transition-colors cursor-pointer"
                                    >
                                        <div className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px] flex-shrink-0">
                                            <Image
                                                src={card.icon}
                                                alt="Feature icon"
                                                width={32}
                                                height={32}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                        <span className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#262626]">
                                            {isEnglish
                                                ? card.text.split('!').map((text, index, array) => (
                                                    <React.Fragment key={index}>
                                                        {text}
                                                        {index < array.length - 1 && (
                                                            <>{`!`}<br /></>
                                                        )}
                                                    </React.Fragment>
                                                ))
                                                : card.text
                                            }
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content - Booking Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="w-full lg:w-auto mt-8 lg:mt-0 flex justify-center lg:justify-start flex-shrink-0"
                    >
                        <BookingForm 
                            onSubmit={(data) => {
                                console.log("Form submitted:", data)
                                // Handle form submission here
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 