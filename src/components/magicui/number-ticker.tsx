'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

type Props = {
  value: number;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
  duration?: number;
  delay?: number;
  locale?: string;
};

export function NumberTicker({
  value,
  formatOptions,
  className,
  duration = 1000,
  delay = 0,
  locale = 'en-US',
}: Props) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true });
  const valueRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const element = elementRef.current;
    if (!element) return;

    const startValue = valueRef.current;
    const endValue = value;
    const startTime = performance.now() + delay;
    startTimeRef.current = startTime;

    const tick = () => {
      const now = performance.now();
      if (now < startTimeRef.current) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - startTimeRef.current) / duration, 1);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * progress
      );

      if (element) {
        element.textContent = new Intl.NumberFormat(
          locale,
          formatOptions
        ).format(currentValue);
      }

      valueRef.current = currentValue;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, formatOptions, duration, delay, isInView, locale]);

  return (
    <span ref={elementRef} className={className}>
      {new Intl.NumberFormat(locale, formatOptions).format(0)}
    </span>
  );
} 