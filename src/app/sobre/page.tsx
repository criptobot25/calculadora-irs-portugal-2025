'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, Target, Users, Shield, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Calculator className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Sobre a Calculadora IRS 2025
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A ferramenta mais completa e precisa para calcular o seu IRS em Portugal. 
            Desenvolvida por especialistas fiscais para simplificar a sua vida.
          </p>
          <Link href="/calculadora">
            <Button size="lg" className="text-lg px-8 py-4">
              Calcular o Meu IRS
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Democratizar o acesso ao cálculo de IRS, oferecendo uma ferramenta 
                  gratuita, precisa e fácil de usar para todos os contribuintes portugueses.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Para Quem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Trabalhadores por conta de outrem, freelancers, empresários, 
                  reformados e qualquer pessoa que precise de calcular o seu IRS.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Os seus dados são processados localmente e nunca armazenados nos nossos servidores. 
                  Total privacidade e conformidade com o RGPD.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Por que escolher a nossa calculadora?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Star className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">100% Atualizada</h3>
                  <p className="text-gray-600">
                    Sempre atualizada com as mais recentes tabelas de IRS e legislação fiscal portuguesa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Star className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fácil de Usar</h3>
                  <p className="text-gray-600">
                    Interface intuitiva que guia você passo a passo através do processo de cálculo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Star className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Relatórios Detalhados</h3>
                  <p className="text-gray-600">
                    Gere relatórios em PDF com breakdown completo dos seus cálculos de IRS.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Star className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Todas as Categorias</h3>
                  <p className="text-gray-600">
                    Suporte completo para rendimentos das categorias A, B, E, F e pensões.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Star className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Deduções Completas</h3>
                  <p className="text-gray-600">
                    Inclui todas as deduções: saúde, educação, habitação, donativos e muito mais.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Star className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gratuita</h3>
                  <p className="text-gray-600">
                    100% gratuita, sem limitações ou taxas ocultas. Use quantas vezes precisar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Desenvolvido por Especialistas</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            A nossa equipa é composta por contabilistas certificados, desenvolvedores especializados 
            e especialistas em fiscalidade portuguesa. Trabalhamos continuamente para manter a 
            calculadora atualizada e precisa.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Disclaimer Importante</h3>
            <p className="text-blue-800 text-sm">
              Esta calculadora fornece estimativas baseadas nos dados fornecidos e na legislação fiscal atual. 
              Para casos complexos ou declarações oficiais, recomendamos sempre a consulta de um contabilista certificado 
              ou a Autoridade Tributária e Aduaneira.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para calcular o seu IRS?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece agora e descubra em minutos quanto vai pagar ou receber.
          </p>
          <Link href="/calculadora">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Começar Cálculo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}