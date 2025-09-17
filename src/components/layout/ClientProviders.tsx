'use client'

import { CookieProvider } from '@/hooks/useCookies'
import { CalculatorProvider } from '@/hooks/useCalculator'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import CookieConsent from '@/components/CookieConsent'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CookieProvider>
      <CalculatorProvider>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </CalculatorProvider>
    </CookieProvider>
  )
}