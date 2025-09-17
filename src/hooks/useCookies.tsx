'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ConsentType {
  necessary: boolean
  analytics: boolean
  advertising: boolean
}

interface CookieContextType {
  consent: ConsentType | null
  showBanner: boolean
  updateConsent: (consent: ConsentType) => void
  acceptAll: () => void
  rejectOptional: () => void
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

const CONSENT_KEY = 'cookie-consent'

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentType | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CONSENT_KEY)
      if (saved) {
        try {
          const parsedConsent = JSON.parse(saved)
          setConsent(parsedConsent)
          setShowBanner(false)
          
          // Load scripts based on consent
          loadScripts(parsedConsent)
        } catch (error) {
          console.error('Error loading cookie consent:', error)
          setShowBanner(true)
        }
      } else {
        setShowBanner(true)
      }
    }
  }, [])

  const loadScripts = (consentData: ConsentType) => {
    if (typeof window === 'undefined') return

    // Google Analytics
    if (consentData.analytics) {
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      })
    }

    // Google AdSense
    if (consentData.advertising) {
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
  }

  const updateConsent = (newConsent: ConsentType) => {
    setConsent(newConsent)
    setShowBanner(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent))
      loadScripts(newConsent)
    }
  }

  const acceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      advertising: true
    }
    updateConsent(allConsent)
  }

  const rejectOptional = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      advertising: false
    }
    updateConsent(minimalConsent)
  }

  return (
    <CookieContext.Provider value={{
      consent,
      showBanner,
      updateConsent,
      acceptAll,
      rejectOptional
    }}>
      {children}
    </CookieContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookieContext)
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider')
  }
  return context
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}