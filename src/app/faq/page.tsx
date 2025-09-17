'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronRight, Search, Calculator, HelpCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    id: 1,
    category: 'Geral',
    question: 'Como funciona a calculadora de IRS?',
    answer: 'A nossa calculadora utiliza as tabelas oficiais de IRS 2025 para calcular o imposto devido com base nos seus rendimentos, deduções e situação familiar. Basta inserir os seus dados nos 4 passos: dados pessoais, rendimentos, deduções e ver o resultado final.'
  },
  {
    id: 2,
    category: 'Geral',
    question: 'A calculadora está atualizada para 2025?',
    answer: 'Sim, a calculadora está sempre atualizada com as mais recentes tabelas de IRS, escalões de rendimento e valores de deduções para o ano fiscal de 2025.'
  },
  {
    id: 3,
    category: 'Rendimentos',
    question: 'Que tipos de rendimentos posso incluir?',
    answer: 'Pode incluir rendimentos da Categoria A (trabalho dependente), Categoria B (trabalho independente), Categoria E (investimentos), Categoria F (rendimentos prediais) e outros rendimentos como pensões e subsídios.'
  },
  {
    id: 4,
    category: 'Rendimentos',
    question: 'Como declaro rendimentos de trabalho independente?',
    answer: 'Os rendimentos de trabalho independente (Categoria B) devem ser inseridos no campo "Rendimentos Empresariais" durante o passo 2. Certifique-se de que escolhe o regime correto (simplificado ou organizado) no passo 3.'
  },
  {
    id: 5,
    category: 'Deduções',
    question: 'Que despesas posso deduzir no IRS?',
    answer: 'Pode deduzir despesas de saúde, educação, habitação (juros de crédito habitação), donativos, seguros, despesas com dependentes, entre outras. A calculadora inclui campos para as principais categorias de deduções.'
  },
  {
    id: 6,
    category: 'Deduções',
    question: 'Qual é o limite das deduções de saúde?',
    answer: 'As despesas de saúde têm um limite de dedução que varia conforme o escalão de rendimento. A calculadora aplica automaticamente os limites corretos baseados nos seus rendimentos totais.'
  },
  {
    id: 7,
    category: 'Deduções',
    question: 'Posso deduzir despesas de educação dos meus filhos?',
    answer: 'Sim, pode deduzir despesas de educação dos seus dependentes, incluindo propinas, mensalidades, material escolar e explicações. O limite anual de dedução é aplicado automaticamente pela calculadora.'
  },
  {
    id: 8,
    category: 'Cálculo',
    question: 'Como é calculada a taxa efetiva de IRS?',
    answer: 'A taxa efetiva é calculada dividindo o imposto total devido pelo rendimento bruto total. Esta taxa representa a percentagem real de imposto que paga sobre os seus rendimentos.'
  },
  {
    id: 9,
    category: 'Cálculo',
    question: 'Qual a diferença entre regime simplificado e organizado?',
    answer: 'No regime simplificado, é aplicada uma dedução fixa baseada no tipo de rendimento. No regime organizado, pode deduzir as despesas reais comprovadas. A calculadora permite escolher o regime mais vantajoso.'
  },
  {
    id: 10,
    category: 'Resultados',
    question: 'O que significa "valor a receber" ou "valor a pagar"?',
    answer: 'Se o resultado for positivo (+), significa que tem direito a um reembolso. Se for negativo (-), significa que tem de pagar mais imposto ao Estado. Isto é calculado comparando o imposto devido com as retenções já efetuadas.'
  },
  {
    id: 11,
    category: 'Resultados',
    question: 'Posso gerar um relatório do cálculo?',
    answer: 'Sim, pode gerar um relatório detalhado em PDF com todos os cálculos, breakdown de rendimentos e deduções, e informações fiscais importantes. Use o botão "Gerar Relatório PDF" na página de resultados.'
  },
  {
    id: 12,
    category: 'Privacidade',
    question: 'Os meus dados são guardados ou partilhados?',
    answer: 'Não. Todos os cálculos são feitos localmente no seu dispositivo. Os seus dados não são enviados para servidores externos nem guardados permanentemente. Respeitamos totalmente a sua privacidade.'
  },
  {
    id: 13,
    category: 'Privacidade',
    question: 'A calculadora está em conformidade com o RGPD?',
    answer: 'Sim, a nossa calculadora está totalmente em conformidade com o RGPD. Não recolhemos, armazenamos ou processamos dados pessoais. Toda a informação permanece no seu dispositivo.'
  },
  {
    id: 14,
    category: 'Precisão',
    question: 'Quão precisa é a calculadora?',
    answer: 'A calculadora utiliza as tabelas oficiais de IRS e algoritmos validados por contabilistas certificados. No entanto, para casos complexos ou declarações oficiais, recomendamos sempre a consulta de um profissional.'
  },
  {
    id: 15,
    category: 'Precisão',
    question: 'Posso usar os resultados para a minha declaração oficial?',
    answer: 'Os resultados são estimativas muito precisas, mas recomendamos que use a calculadora como ferramenta de planeamento. Para a declaração oficial, consulte sempre um contabilista ou use o Portal das Finanças.'
  }
]

const categories = ['Todos', ...Array.from(new Set(faqs.map(faq => faq.category)))]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <HelpCircle className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Perguntas Frequentes
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o cálculo de IRS 
            e como usar a nossa calculadora.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Pesquisar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {filteredFAQs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os termos de pesquisa ou categoria.
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos') }}>
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium mt-1">
                          {faq.category}
                        </div>
                        <CardTitle className="text-left text-lg">
                          {faq.question}
                        </CardTitle>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedFAQ === faq.id && (
                    <CardContent className="border-t bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Ainda tem dúvidas?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Se não encontrou a resposta que procurava, experimente a nossa calculadora 
            ou entre em contacto connosco.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculadora">
              <Button size="lg" className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Experimentar Calculadora
              </Button>
            </Link>
            <Link href="/contactos">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Contactar-nos
              </Button>
            </Link>
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
            Use a nossa calculadora gratuita e descubra quanto vai pagar ou receber.
          </p>
          <Link href="/calculadora">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}