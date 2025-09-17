'use client'

import React from 'react'
import { useCookies } from '@/hooks/useCookies'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cookie } from 'lucide-react'

export function CookieBanner() {
  const { showBanner, acceptAll, rejectOptional, updateConsent } = useCookies()
  const [showDetails, setShowDetails] = React.useState(false)

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-white shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Utilizamos cookies para melhorar a sua experiência
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Este site utiliza cookies para garantir funcionalidades essenciais, 
                analisar o tráfego e exibir anúncios relevantes. Pode escolher quais 
                cookies aceitar.
              </p>

              {showDetails && (
                <div className="mb-4 space-y-3 p-4 bg-gray-50 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies Necessários</h4>
                    <p className="text-xs text-gray-600">
                      Essenciais para o funcionamento básico do site. Sempre ativos.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies Analíticos</h4>
                    <p className="text-xs text-gray-600">
                      Google Analytics para compreender como utiliza o site.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies Publicitários</h4>
                    <p className="text-xs text-gray-600">
                      Google AdSense para exibir anúncios relevantes.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={acceptAll}
                  variant="primary"
                  size="sm"
                  className="min-w-[120px]"
                >
                  Aceitar Todos
                </Button>
                
                <Button
                  onClick={rejectOptional}
                  variant="outline"
                  size="sm"
                  className="min-w-[120px]"
                >
                  Apenas Necessários
                </Button>
                
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  size="sm"
                >
                  {showDetails ? 'Ocultar' : 'Personalizar'}
                </Button>
              </div>

              {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Cookies Necessários (obrigatórios)
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="analytics"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Cookies Analíticos
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="advertising"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Cookies Publicitários
                      </span>
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const analytics = (document.getElementById('analytics') as HTMLInputElement)?.checked
                        const advertising = (document.getElementById('advertising') as HTMLInputElement)?.checked
                        
                        updateConsent({
                          necessary: true,
                          analytics: analytics || false,
                          advertising: advertising || false
                        })
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Guardar Preferências
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}