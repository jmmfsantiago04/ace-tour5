'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type HomeHeroProps = {
  videoSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function HomeHero({ videoSrc = '/home/videoHome.mp4', imageSrc, imageAlt = 'Tour Guide' }: HomeHeroProps) {
  const t = useTranslations('HomeHero');
  const params = useParams();
  const isEnglish = params.locale === 'en';

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const mediaRef = useRef(null);

  const isTitleInView = useInView(titleRef, { once: true });
  const isContentInView = useInView(contentRef, { once: true });
  const isButtonInView = useInView(buttonRef, { once: true });
  const isMediaInView = useInView(mediaRef, { once: true });

  const getTitleContent = () => {
    if (!isEnglish) {
      return (
        <div className="inline">
          <span className="text-[#F6B600]">{t('titleHighlight')}</span>
          {' '}
          {t('titleEnd')}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        <span className="text-[#262626]">{t('titleStart')}</span>
        <span className="text-[#F6B600]">{t('titleHighlight')}</span>
      </div>
    );
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="flex flex-col space-y-8 pt-16">
          {/* Title and Content Container */}
          <div className="flex flex-col space-y-8">
            {/* Title */}
            <div className="max-w-[756px]" ref={titleRef}>
              <motion.h1
                className={`text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] leading-[2.5rem] sm:leading-[3rem] md:leading-[3.875rem] tracking-[-0.02em] font-semibold ${
                  isEnglish ? 'flex flex-row items-start gap-1 md:gap-2' : 'h-full flex items-center'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
              >
                {getTitleContent()}
              </motion.h1>
            </div>

            {/* Content and Button Container */}
            <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:justify-between">
              {/* Button */}
              <motion.div
                ref={buttonRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isButtonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="md:w-auto"
              >
                <Link
                  href="/??"
                  className="group inline-flex h-12 w-[251px] items-center justify-between rounded-[10px] bg-[#1976D2] hover:bg-[#1565C0] pl-5 pr-1 text-white transition-all"
                >
                  <span className="text-base font-medium leading-6">
                    {t('button')}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white">
                    <svg
                      className="h-5 w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1"
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

              {/* Content */}
              <motion.div
                ref={contentRef}
                className="w-full md:w-[361px] md:ml-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-base font-medium leading-6 text-[#475467]">
                  {t('description')}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Media Container */}
          <motion.div
            ref={mediaRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isMediaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mt-8 rounded-2xl border border-[#EAECF0] overflow-hidden w-full aspect-[2.017]"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 