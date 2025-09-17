'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, ArrowRight, TrendingUp, FileText, Calculator } from 'lucide-react'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'Mudanças no IRS para 2025: O que precisa de saber',
    excerpt: 'Descubra as principais alterações fiscais para 2025 e como podem afetar a sua declaração de IRS.',
    content: 'As principais alterações para o IRS 2025 incluem novos escalões de rendimento, aumento dos mínimos de existência e mudanças nas deduções de saúde e educação. É importante estar atualizado sobre estas mudanças para otimizar a sua declaração.',
    author: 'Equipa Fiscal',
    date: '2025-01-15',
    readTime: '5 min',
    category: 'Legislação',
    featured: true
  },
  {
    id: 2,
    title: 'Como maximizar as suas deduções de IRS',
    excerpt: 'Estratégias legais para reduzir o imposto a pagar através de deduções fiscais.',
    content: 'Existem várias formas de maximizar as suas deduções de IRS: manter todos os comprovativos de despesas de saúde, educação e habitação, fazer donativos a instituições de solidariedade social, e considerar a opção por tributação conjunta ou separada no caso de casais.',
    author: 'Ana Silva',
    date: '2025-01-10',
    readTime: '7 min',
    category: 'Dicas',
    featured: false
  },
  {
    id: 3,
    title: 'IRS para freelancers e trabalhadores independentes',
    excerpt: 'Guia completo para declarar rendimentos de trabalho independente.',
    content: 'Os trabalhadores independentes têm regras específicas para a declaração de IRS. É essencial escolher entre o regime simplificado e organizado, manter registos detalhados de despesas profissionais e fazer os pagamentos por conta atempadamente.',
    author: 'João Santos',
    date: '2025-01-05',
    readTime: '10 min',
    category: 'Guias',
    featured: false
  },
  {
    id: 4,
    title: 'Erro mais comuns na declaração de IRS',
    excerpt: 'Evite estes erros frequentes que podem complicar a sua declaração.',
    content: 'Os erros mais comuns incluem não declarar todos os rendimentos, ultrapassar os limites de deduções, não guardar comprovativos e esquecer-se de incluir rendimentos de investimentos. Uma declaração correta evita problemas futuros.',
    author: 'Maria Costa',
    date: '2024-12-20',
    readTime: '6 min',
    category: 'Dicas',
    featured: false
  },
  {
    id: 5,
    title: 'Planeamento fiscal: preparar o IRS durante o ano',
    excerpt: 'Como organizar as suas finanças ao longo do ano para facilitar a declaração.',
    content: 'Um bom planeamento fiscal durante o ano facilita muito a preparação da declaração de IRS. Organize despesas por categorias, mantenha um registo digital de faturas e considere investimentos com benefícios fiscais.',
    author: 'Pedro Oliveira',
    date: '2024-12-15',
    readTime: '8 min',
    category: 'Planeamento',
    featured: false
  }
]

const categories = ['Todos', ...Array.from(new Set(blogPosts.map(post => post.category)))]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <FileText className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Blog IRS 2025
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Mantenha-se atualizado com as últimas notícias, dicas e guias 
            sobre IRS e fiscalidade em Portugal.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 pb-20">
        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map(post => (
          <Card key={post.id} className="mb-12 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">
                  Artigo em Destaque
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {post.title}
              </h2>
              <p className="text-lg opacity-90 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm opacity-80">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('pt-PT')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                {post.content}
              </p>
              <Button className="group">
                Ler Artigo Completo
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Other Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.filter(post => !post.featured).map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <Card className="mt-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Mantenha-se Atualizado
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Receba as últimas notícias e dicas sobre IRS diretamente no seu email. 
              Sem spam, apenas conteúdo útil para o ajudar com as suas finanças.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="O seu email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button>
                Subscrever
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Ao subscrever, aceita receber emails informativos. Pode cancelar a qualquer momento.
            </p>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
            <CardContent className="p-8">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-4">
                Pronto para calcular o seu IRS?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Use a nossa calculadora gratuita e descubra quanto vai pagar ou receber.
              </p>
              <Link href="/calculadora">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  Calcular IRS Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}