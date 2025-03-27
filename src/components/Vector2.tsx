import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import clsx from 'clsx'
import React from 'react'

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

  return (
    <div
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
    </div>
  )
} 