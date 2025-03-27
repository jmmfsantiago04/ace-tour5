'use client'

import { CldUploadWidget } from 'next-cloudinary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CldUploadWidget.Provider config={{
      cloudName: 'dljqpsuv6'
    }}>
      {children}
    </CldUploadWidget.Provider>
  )
} 