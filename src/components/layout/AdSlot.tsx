'use client'

import React from 'react'
import { useCookies } from '@/hooks/useCookies'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'banner'
  style?: React.CSSProperties
  className?: string
  responsive?: boolean
}

export function AdSlot({ 
  slot, 
  format = 'auto', 
  style,
  className = '',
  responsive = true 
}: AdSlotProps) {
  const { consent } = useCookies()
  const adRef = React.useRef<HTMLDivElement>(null)
  const [adLoaded, setAdLoaded] = React.useState(false)

  React.useEffect(() => {
    // Only load ads if user consented to advertising cookies
    if (!consent?.advertising || adLoaded) return

    const loadAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({})
          setAdLoaded(true)
        }
      } catch (error) {
        console.error('Error loading ad:', error)
      }
    }

    // Small delay to ensure AdSense script is loaded
    const timer = setTimeout(loadAd, 100)
    return () => clearTimeout(timer)
  }, [consent?.advertising, adLoaded])

  // Don't render if user hasn't consented to ads
  if (!consent?.advertising) {
    return (
      <div className={`bg-gray-100 border border-gray-200 rounded-md p-4 text-center ${className}`}>
        <p className="text-sm text-gray-500">
          Aceite cookies publicitários para ver anúncios relevantes
        </p>
      </div>
    )
  }

  const adStyle = {
    display: 'block',
    ...style
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
      />
    </div>
  )
}

// Predefined ad slots for different positions
export function HeaderAd() {
  return (
    <AdSlot
      slot="1234567890" // Replace with actual ad slot ID
      format="banner"
      className="my-4 text-center"
      style={{ width: '728px', height: '90px' }}
    />
  )
}

export function SidebarAd() {
  return (
    <AdSlot
      slot="1234567891" // Replace with actual ad slot ID
      format="rectangle"
      className="my-4"
      style={{ width: '300px', height: '250px' }}
    />
  )
}

export function InArticleAd() {
  return (
    <AdSlot
      slot="1234567892" // Replace with actual ad slot ID
      format="fluid"
      className="my-6"
      style={{ minHeight: '250px' }}
    />
  )
}

export function MobileAd() {
  return (
    <AdSlot
      slot="1234567893" // Replace with actual ad slot ID
      format="banner"
      className="my-4 md:hidden"
      style={{ width: '320px', height: '50px' }}
    />
  )
}

// Type declaration for AdSense
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}