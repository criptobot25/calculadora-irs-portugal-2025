'use client'

import Link from 'next/link'
import { Calculator, Mail, MapPin } from 'lucide-react'

const footerNavigation = {
  main: [
    { name: 'Início', href: '/' },
    { name: 'Calculadora', href: '/calculadora' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contactos', href: '/contactos' },
  ],
  legal: [
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'Cookies', href: '/cookies' },
  ],
  resources: [
    { name: 'Portal das Finanças', href: 'https://www.portaldasfinancas.gov.pt', external: true },
    { name: 'Autoridade Tributária', href: 'https://www.at.gov.pt', external: true },
    { name: 'Simulador Oficial', href: 'https://www.portaldasfinancas.gov.pt/at/html/index.html', external: true },
  ]
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <Calculator className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">
                  Calculadora IRS
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-600">
                Calcule o seu IRS de forma simples e gratuita. 
                Resultados estimados para fins informativos.
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>info@calculadorairs.pt</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Lisboa, Portugal</span>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Navegação
              </h3>
              <ul className="mt-4 space-y-2">
                {footerNavigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Recursos Úteis
              </h3>
              <ul className="mt-4 space-y-2">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      {...(item.external && { 
                        target: '_blank', 
                        rel: 'noopener noreferrer' 
                      })}
                    >
                      {item.name}
                      {item.external && ' ↗'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-600">
              © 2025 Calculadora IRS Portugal. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-500">
              Este site não é oficial da Autoridade Tributária. 
              Resultados são estimados e apenas para fins informativos.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}