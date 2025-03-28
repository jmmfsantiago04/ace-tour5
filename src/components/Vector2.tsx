'use client'

import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import clsx from 'clsx'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Vector2Props = {
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
}

export const Vector2: React.FC<Vector2Props> = (props) => {
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ 
        opacity: scrollYProgress,
        y: useTransform(scrollYProgress, [0, 1], [50, 0])
      }}
      className={clsx(
        'relative flex items-center justify-center',
        className,
      )}
    >
      <div
        style={{
          width: '3px',
          height: '148.5px',
        }}
        className="overflow-hidden"
      >
        <Image
          src="/home/vector2.png"
          alt="Vector 2"
          className={clsx('rounded', imgClassName, {
            'w-[3px]': true,
            'h-[148.5px]': true
          })}
          width={3}
          height={148.5}
        />
      </div>
    </motion.div>
  )
} 