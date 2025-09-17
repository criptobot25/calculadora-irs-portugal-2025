import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, CheckCircle, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Calculadora IRS Portugal 2025 - Calcule o seu Imposto de Forma Gratuita',
  description: 'Calcule o seu IRS para 2025 de forma simples e gratuita. Descubra se vai receber reembolso ou pagar imposto.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Calcule o seu <span className="text-blue-600">IRS 2025</span> em minutos
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Descubra se vai receber reembolso ou pagar imposto. 
              Calculadora gratuita, simples e baseada nas tabelas oficiais.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator">
                <Button variant="primary" size="xl" className="w-full sm:w-auto">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular o meu IRS
                </Button>
              </Link>
              
              <Link href="/sobre">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Como funciona?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Porquê escolher a nossa calculadora?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Cálculo Simples</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Interface intuitiva com wizard passo-a-passo.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Resultados Precisos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Baseado nas tabelas oficiais de IRS 2025.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Dados Seguros</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Os seus dados ficam no seu dispositivo.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Rápido e Gratuito</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Calcule o seu IRS em menos de 5 minutos.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para calcular o seu IRS?
          </h2>
          
          <Link href="/calculator">
            <Button variant="default" size="xl" className="bg-white text-blue-600 hover:bg-gray-50">
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Agora - Grátis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
