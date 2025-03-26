'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

export function Footer() {
  const t = useTranslations('Footer');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="flex justify-center w-full px-4 sm:px-6 lg:px-0">
      <footer className="bg-[#1B365D] text-white w-full max-w-[1232px] min-h-[397px] rounded-[22px] pt-[60px] px-4 sm:px-6 lg:pl-[80px] relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute w-full max-w-[981px] h-[564px] overflow-hidden left-1/2 -translate-x-1/2">
          <Image
            src="/footerbgworld.png"
            alt="World Map Background"
            width={981}
            height={564}
            className="object-contain "
            priority
          />
        </div>
        <div className="relative z-[2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[354px_139px_274px_152px] gap-8 lg:gap-x-[55px]">
          {/* Newsletter Section */}
          <div className="w-full max-w-[354px] h-full">
            <Image
              src="/LogoWhite.png"
              alt="ACE Tours Logo"
              width={107}
              height={55}
              className="object-contain"
            />
            <div className="mt-[15px]">
              <h3 className="font-black text-[20px] leading-[28px] tracking-[0%] text-[#FFFFFF80]">{t('newsletter.title')}</h3>
              <p className="font-medium mb-[15px] mt-[55px] text-[16px] leading-[24px] tracking-[0%] text-[#FFFFFF80]">
                {t('newsletter.description')}
              </p>
              <div className="relative w-full max-w-[328px] overflow-hidden rounded-[8px]">
                <input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  className="h-[40px] w-full pl-[16px] text-black bg-white outline-none pr-[132px] font-medium text-[14px] leading-[20px] tracking-[0px] placeholder:font-medium placeholder:text-[14px] placeholder:leading-[20px] placeholder:tracking-[0px] py-[10px]"
                />
                <button className="absolute top-0 right-0 w-[122px] h-[40px] bg-[#F6B600] text-white font-medium hover:bg-[#e5a912] transition-colors text-[16px] leading-[24px] tracking-[0%] flex items-center justify-center rounded-[8px]">
                  {t('newsletter.button')}
                </button>
              </div>
            </div>
          </div>

          {/* Sitemap Section */}
          <div className="w-full max-w-[139px]">
            <h3 className="font-semibold text-[16px] leading-[24px] tracking-[0%] mb-6">{t('sitemap.title')}</h3>
            <nav className="flex flex-col gap-[24px]">
              <Link href={`/${locale}`} className="block text-[#FFFFFF] opacity-70 hover:opacity-100 hover:text-white font-medium text-[14px] leading-[20px] tracking-[0px]">
                {t('sitemap.home')}
              </Link>
              <Link href={`/${locale}/travel-packages`} className="block text-[#FFFFFF] opacity-70 hover:opacity-100 hover:text-white font-medium text-[14px] leading-[20px] tracking-[0px]">
                {t('sitemap.travelPackages')}
              </Link>
              <Link href={`/${locale}/shuttle-bus`} className="block text-[#FFFFFF] opacity-70 hover:opacity-100 hover:text-white font-medium text-[14px] leading-[20px] tracking-[0px]">
                {t('sitemap.shuttleBus')}
              </Link>
              <Link href={`/${locale}/mice-solutions`} className="block text-[#FFFFFF] opacity-70 hover:opacity-100 hover:text-white font-medium text-[14px] leading-[20px] tracking-[0px]">
                {t('sitemap.miceSolutions')}
              </Link>
              <Link href={`/${locale}/support`} className="block text-[#FFFFFF] opacity-70 hover:opacity-100 hover:text-white font-medium text-[14px] leading-[20px] tracking-[0px]">
                {t('sitemap.support')}
              </Link>
            </nav>
          </div>

          {/* Contact Info Section */}
          <div className="w-full max-w-[274px]">
            <div>
              <h3 className="font-semibold text-[16px] leading-[24px] tracking-[0%] mb-[8px]">{t('contact.businessHours.title')}</h3>
              <p className="text-[#FAFAFA] opacity-70 font-normal text-[14px] leading-[20px] tracking-[0px]">
                {t('contact.businessHours.hours')}
              </p>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-[16px] leading-[24px] tracking-[0%] mb-[8px]">{t('contact.email.title')}</h3>
              <a href="mailto:support@acetravel.com" className="text-[#FAFAFA] opacity-70 hover:opacity-100 hover:text-white font-normal text-[14px] leading-[20px] tracking-[0px]">
                {t('contact.email.address')}
              </a>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-[16px] leading-[24px] tracking-[0%] mb-[8px]">{t('contact.phone.title')}</h3>
              <a href="tel:+1(800)123-4567" className="text-[#FAFAFA] opacity-70 hover:opacity-100 hover:text-white font-normal text-[14px] leading-[20px] tracking-[0px]">
                {t('contact.phone.number')}
              </a>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="w-full max-w-[152px]">
            <h3 className="text-lg font-semibold mb-6">{t('social.title')}</h3>
            <div className="flex gap-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-[40px] h-[40px] rounded-full bg-[#D9D9D933] flex items-center justify-center text-white hover:opacity-100 p-[10px]"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-[40px] h-[40px] rounded-full bg-[#D9D9D933] flex items-center justify-center text-white hover:opacity-100 p-[10px]"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-[40px] h-[40px] rounded-full bg-[#D9D9D933] flex items-center justify-center text-white hover:opacity-100 p-[10px]"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-[30px] pt-[30px] border-t border-[#FFFFFF10] w-full flex items-center justify-end px-4 lg:pr-[40px]">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-[40px] items-center mb-[10px] opacity-70">
            <Link href={`/${locale}/privacy-policy`} className="text-[#FFFFFF50] hover:text-white hover:opacity-100">
              {t('legal.privacyPolicy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-[#FFFFFF50] hover:text-white hover:opacity-100">
              {t('legal.terms')}
            </Link>
            <p className="text-[#FFFFFF50]">{t('legal.copyright')} {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}