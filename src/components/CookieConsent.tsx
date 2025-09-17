'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cookie, X, Settings } from 'lucide-react'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const acceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    setPreferences(newPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    setShowConsent(false)
    setShowSettings(false)
  }

  const acceptNecessary = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    setPreferences(newPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    setShowConsent(false)
    setShowSettings(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShowConsent(false)
    setShowSettings(false)
  }

  const updatePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-t-blue-600">
        <CardContent className="p-6">
          {!showSettings ? (
            // Main consent banner
            <div className="flex items-start gap-4">
              <Cookie className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Utilizamos Cookies
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais 
                  para melhorar a sua experiência. Os dados da calculadora são sempre processados 
                  localmente no seu dispositivo.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={acceptAll} size="sm">
                    Aceitar Todos
                  </Button>
                  <Button onClick={acceptNecessary} variant="outline" size="sm">
                    Apenas Necessários
                  </Button>
                  <Button 
                    onClick={() => setShowSettings(true)} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Settings className="h-4 w-4" />
                    Personalizar
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={acceptNecessary}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Settings panel
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Preferências de Cookies
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Cookies Necessários</h4>
                    <p className="text-sm text-gray-600">
                      Essenciais para o funcionamento básico do site. Não podem ser desativados.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Cookies de Análise</h4>
                    <p className="text-sm text-gray-600">
                      Ajudam-nos a compreender como os utilizadores interagem com o site.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => updatePreference('analytics', !preferences.analytics)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Cookies de Marketing</h4>
                    <p className="text-sm text-gray-600">
                      Utilizados para personalizar anúncios e medir a eficácia das campanhas.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => updatePreference('marketing', !preferences.marketing)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button onClick={savePreferences} size="sm">
                  Guardar Preferências
                </Button>
                <Button onClick={acceptAll} variant="outline" size="sm">
                  Aceitar Todos
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Para mais informações, consulte a nossa{' '}
                <a href="/privacidade" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}