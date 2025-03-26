'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/i18n/navigation';

type ContentItem = {
  text?: string;
  id?: string;
}

type Card = {
  title?: string;
  content?: ContentItem[];
}

type OurMissionProps = {
  imageSrc?: string;
  imageAlt?: string;
};

export function OurMission({ imageSrc, imageAlt = 'Our Mission' }: OurMissionProps) {
  const t = useTranslations('OurMission');
  const params = useParams();
  const isEnglish = params.locale === 'en';

  const labelRef = useRef(null);
  const buttonsRef = useRef(null);
  const mediaRef = useRef(null);
  const [cardRefs, setCardRefs] = useState<Array<HTMLDivElement | null>>([]);

  const cards = [
    {
      title: t('card1.title'),
      content: [{ text: t('card1.content') }]
    },
    {
      title: t('card2.title'),
      content: [{ text: t('card2.content') }]
    },
    {
      title: t('card3.title'),
      content: [{ text: t('card3.content') }]
    }
  ];

  useEffect(() => {
    setCardRefs(new Array(cards.length).fill(null));
  }, []);

  const isLabelInView = useInView(labelRef, { once: true });
  const isButtonsInView = useInView(buttonsRef, { once: true });
  const isMediaInView = useInView(mediaRef, { once: true });

  // Function to add line break after "and"
  const formatContent = (text: string) => {
    return text.split(' and ').map((part, index, array) => (
      <span key={index}>
        {part}
        {index < array.length - 1 && (
          <>
            {' and'}
            <br />
          </>
        )}
      </span>
    ));
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label and Content */}
        <motion.div
          ref={labelRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isLabelInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center w-[16.5rem] h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-[#F6B600] p-[0.5rem] mb-4 sm:mb-6 bg-[#F6B600]/10">
            <span className="text-sm font-medium text-[#F6B600]">
              {t('title')}
            </span>
          </div>

          <div className="w-full sm:w-[37.5rem] md:w-[49.75rem] h-auto sm:h-[5rem] md:h-[6rem] mx-auto px-4 sm:px-0">
            <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] leading-[2rem] sm:leading-[2.5rem] md:leading-[3rem] tracking-[0] font-semibold text-gray-900 text-center">
              {formatContent(t('content'))}
            </h2>
          </div>


        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {cards.map((card, index) => {
            const cardRef = useRef<HTMLDivElement | null>(null);
            const isCardInView = useInView(cardRef, { once: true });

            return (
              <motion.div
                key={index}
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="w-full max-w-[23.4375rem] h-[18.75rem] sm:h-[20rem] md:h-[21.25rem] bg-[#1B365C] rounded-tl-xl rounded-tr-xl rounded-bl-xl sm:rounded-tl-2xl sm:rounded-tr-2xl sm:rounded-bl-2xl p-6 sm:p-7 md:p-8 text-white border border-[#1B365C] flex flex-col"
              >
                <h3 className="text-[1rem] sm:text-[1.0625rem] md:text-[20px] leading-[1.5rem] sm:leading-[1.625rem] md:leading-[28px] tracking-[0] font-semibold mb-4 align-middle">
                  {card.title}
                </h3>
                <div className="space-y-4">
                  {card.content?.map((contentItem, contentIndex) => (
                    <p
                      key={contentIndex}
                      className="text-[0.875rem] sm:text-[0.9375rem] md:text-[16px] leading-[1.25rem] sm:leading-[1.375rem] md:leading-[24px] tracking-[0] font-medium align-middle text-white/80"
                    >
                      {contentItem.text}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
} 