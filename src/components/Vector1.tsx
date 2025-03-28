'use client'

import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import clsx from 'clsx'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Vector1Props = {
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
}

export const Vector1: React.FC<Vector1Props> = (props) => {
  const {
    className,
    enableGutter = true,
    imgClassName,
  } = props

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{ 
        opacity: scrollYProgress,
        scale: scale
      }}
      className={clsx(
        'relative flex items-center justify-center',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      <div
        style={{
          width: '156px',
          height: '148.5px',
        }}
        className="overflow-hidden"
      >
        <Image
          src="/home/vector1.png"
          alt="Vector 1"
          className={clsx('rounded', imgClassName, {
            'w-[156px]': true,
            'h-[148.5px]': true
          })}
          width={156}
          height={148.5}
        />
      </div>
    </motion.div>
  )
} 