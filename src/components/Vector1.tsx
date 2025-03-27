import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import clsx from 'clsx'
import React from 'react'

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

  return (
    <div
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
    </div>
  )
} 