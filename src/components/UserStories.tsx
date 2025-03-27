'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/i18n/navigation';

type Review = {
  id: string;
  reviewerInitial: string;
  reviewerName: string;
  reviewText: string;
  readMoreLink?: string | null;
};

type UserStoriesProps = {
  id?: string;
  reviews?: Review[];
};

export function UserStories({ id, reviews }: UserStoriesProps) {
  const t = useTranslations('UserStories');
  const params = useParams();

  const headerRef = useRef(null);
  const buttonsRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true });
  const isButtonsInView = useInView(buttonsRef, { once: true });

  // If no reviews are provided as props, use the default ones from translations
  const defaultStories = [
    {
      id: '1',
      reviewerInitial: t('story1.initial'),
      reviewerName: t('story1.name'),
      reviewText: t('story1.text'),
      readMoreLink: t('story1.link')
    },
    {
      id: '2',
      reviewerInitial: t('story2.initial'),
      reviewerName: t('story2.name'),
      reviewText: t('story2.text'),
      readMoreLink: t('story2.link')
    },
    {
      id: '3',
      reviewerInitial: t('story3.initial'),
      reviewerName: t('story3.name'),
      reviewText: t('story3.text'),
      readMoreLink: t('story3.link')
    }
  ];

  const stories = reviews?.length ? reviews : defaultStories;

  // Create an infinite sequence of stories
  const duplicatedStories = [...stories, ...stories, ...stories, ...stories, ...stories, ...stories];
  
  const cardWidth = 280; // Base width in pixels
  const gap = 16; // Base gap in pixels
  const totalWidth = duplicatedStories.length * (cardWidth + gap);

  return (
    <section className="relative pt-[3.4375rem] px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="mx-auto w-full max-w-7xl">
        {/* Title and Description */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center w-[12.5rem] sm:w-[14.5rem] md:w-[16.5rem] h-[2rem] sm:h-[2.25rem] md:h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-[#F6B600] p-[0.375rem] sm:p-[0.4375rem] md:p-[0.5rem] mb-4 sm:mb-5 md:mb-6 bg-[#F6B600]/10">
            <span className="text-xs sm:text-sm font-medium text-[#F6B600]">
              {t('title')}
            </span>
          </div>
          <div className="w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto px-4 sm:px-0">
            <p className="text-[#262626] text-[1.75rem] sm:text-[2.125rem] md:text-[2.5rem] leading-[2.25rem] sm:leading-[2.625rem] md:leading-[3rem] tracking-[0] font-semibold text-center">
              {t('description')}
            </p>
          </div>
        </motion.div>

        {/* Story Cards Carousel */}
        <div className="relative w-full sm:w-[37.5rem] md:w-[56.25rem] lg:w-[72rem] h-[31.25rem] sm:h-[34.375rem] md:h-[37.375rem] mx-auto bg-[#A3D5FF] rounded-t-[1.25rem] rounded-br-[1.25rem] overflow-hidden">
          <div className="grid grid-rows-2 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-6 md:p-8">
            {/* First Row */}
            <motion.div
              className="flex gap-4 sm:gap-5 md:gap-6"
              animate={{
                x: [-totalWidth/2, -totalWidth]
              }}
              transition={{
                x: {
                  duration: duplicatedStories.length * 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }
              }}
            >
              {duplicatedStories.map((story, index) => (
                <motion.div
                  key={`row1-${story.id}-${index}`}
                  className="flex-shrink-0 w-[17.5rem] sm:w-[22.5rem] md:w-[28.8125rem] h-[12.5rem] sm:h-[13.75rem] md:h-[15.75rem] rounded-[1.25rem]  bg-white p-4 sm:p-6 md:p-8"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#A3D5FF33] flex items-center justify-center">
                        <span className="text-[#1976D2] text-lg sm:text-xl md:text-2xl font-bold">
                          {story.reviewerInitial}
                        </span>
                      </div>
                      <div className="text-[#1976D2] text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] leading-[1.375rem] sm:leading-[1.5rem] md:leading-[1.75rem] tracking-[0] font-semibold align-middle">
                        {story.reviewerName}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3 md:mt-4 flex flex-col justify-between flex-grow">
                      <p className="text-[#1976D2] text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] leading-[1.25rem] sm:leading-[1.375rem] md:leading-[1.5rem] tracking-[0] font-medium align-middle">
                        {story.reviewText}
                        {story.readMoreLink && (
                          <Link href={story.readMoreLink} className="text-[#1976D2] text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] hover:underline cursor-pointer">
                            ...Read More
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Second Row */}
            <motion.div
              className="flex gap-4 sm:gap-5 md:gap-6"
              animate={{
                x: [-totalWidth/2, -totalWidth]
              }}
              transition={{
                x: {
                  duration: duplicatedStories.length * 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                  delay: 2
                }
              }}
            >
              {duplicatedStories.map((story, index) => (
                <motion.div
                  key={`row2-${story.id}-${index}`}
                  className="flex-shrink-0 w-[17.5rem] sm:w-[22.5rem] md:w-[28.8125rem] h-[12.5rem] sm:h-[13.75rem] md:h-[15.75rem] rounded-[1.25rem] border border-[#E5E7EB] bg-white p-4 sm:p-6 md:p-8"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#A3D5FF33] flex items-center justify-center">
                        <span className="text-[#1976D2] text-lg sm:text-xl md:text-2xl font-bold">
                          {story.reviewerInitial}
                        </span>
                      </div>
                      <div className="text-[#1976D2] text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] leading-[1.375rem] sm:leading-[1.5rem] md:leading-[1.75rem] tracking-[0] font-semibold align-middle">
                        {story.reviewerName}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3 md:mt-4 flex flex-col justify-between flex-grow">
                      <p className="text-[#1976D2] text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] leading-[1.25rem] sm:leading-[1.375rem] md:leading-[1.5rem] tracking-[0] font-medium align-middle">
                        {story.reviewText}
                        {story.readMoreLink && (
                          <Link href={story.readMoreLink} className="text-[#1976D2] text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] hover:underline cursor-pointer">
                            ...Read More
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Action Button */}
        <motion.div
          ref={buttonsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isButtonsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-6 sm:mt-8 md:mt-12"
        >
          <Link
            href={t('button.link')}
            className="group inline-flex h-[2.5rem] sm:h-[2.75rem] md:h-[3rem] w-[12.5rem] sm:w-[14.0625rem] md:w-[15.6875rem] items-center justify-between rounded-lg bg-[#1976D2] pl-4 sm:pl-4.5 md:pl-5 pr-1 text-white transition-all hover:bg-[#1565C0]"
          >
            <span className="text-sm sm:text-base font-medium leading-5 sm:leading-6 tracking-[0]">
              {t('button.label')}
            </span>
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-white">
              <svg
                className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1"
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
        </motion.div>
      </div>
    </section>
  );
} 