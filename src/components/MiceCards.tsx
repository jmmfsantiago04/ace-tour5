'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface MiceCard {
    id: string;
    label: string;
    date: string;
    content: string;
    image: {
        url: string;
        alt: string;
    };
}

interface MiceCardsProps {
    cards?: MiceCard[];
}

export function MiceCards({ cards = [] }: MiceCardsProps) {
    // Default cards if none provided
    const defaultCards = [
        {
            id: "1",
            label: "MICE",
            date: "March 15, 2024",
            content: "Corporate Event Planning & Management",
            image: {
                url: "/placeholder.png",
                alt: "Corporate Event"
            }
        },
        {
            id: "2",
            label: "MICE",
            date: "April 20, 2024",
            content: "Conference & Meeting Solutions",
            image: {
                url: "/placeholder.png",
                alt: "Conference"
            }
        },
        {
            id: "3",
            label: "MICE",
            date: "May 10, 2024",
            content: "Incentive Travel Programs",
            image: {
                url: "/placeholder.png",
                alt: "Incentive Travel"
            }
        }
    ];

    const displayCards = cards.length > 0 ? cards : defaultCards;

    return (
        <section className="relative flex justify-center w-full px-4 sm:px-6 lg:px-8 bg-white">
            <div className="relative w-full max-w-7xl py-8 sm:py-12 lg:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mx-auto">
                    {displayCards.map((card, i) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex flex-col w-full bg-white overflow-hidden"
                        >
                            {/* Image Container */}
                            <div className="relative w-full aspect-[1.58] rounded-t-[1.25rem] rounded-bl-[1.25rem] overflow-hidden">
                                <Image
                                    src={card.image.url}
                                    alt={card.image.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center justify-center w-auto min-w-[7.625rem] h-10 bg-[#FAFAFA80] border border-white/20 rounded-[1.375rem] px-4">
                                        <span className="text-sm sm:text-base font-semibold leading-[1.5rem] tracking-[0] text-[#FAFAFA]">
                                            {card.label}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="flex flex-col justify-center w-full py-3 sm:py-4 bg-white">
                                <span className="text-sm sm:text-[0.875rem] font-semibold leading-5 tracking-[0] text-[#262626]/80">
                                    {card.date}
                                </span>
                                <p className="text-base sm:text-[1.0625rem] font-semibold leading-6 sm:leading-7 tracking-[0] text-[#262626] line-clamp-1">
                                    {card.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
} 