'use client'

import Script from 'next/script'

export function CloudinaryScript() {
  return (
    <Script 
      src="https://upload-widget.cloudinary.com/global/all.js" 
      strategy="lazyOnload"
    />
  )
} 