'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calculator, AlertCircle } from 'lucide-react'

export default function ContactosPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', category: '', message: '' })
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Obrigado pelo seu contacto. Responderemos o mais rapidamente possível.
            </p>
            <Button onClick={() => setSubmitted(false)} className="w-full">
              Enviar Nova Mensagem
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <MessageCircle className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Contactos
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tem dúvidas sobre a calculadora de IRS ou precisa de ajuda? 
            Estamos aqui para o ajudar.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Suporte Técnico</p>
                <a href="mailto:suporte@calculadora-irs.pt" className="text-blue-600 hover:underline">
                  suporte@calculadora-irs.pt
                </a>
                <p className="text-gray-600 mt-4 mb-2">Questões Fiscais</p>
                <a href="mailto:fiscal@calculadora-irs.pt" className="text-blue-600 hover:underline">
                  fiscal@calculadora-irs.pt
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Segunda a Sexta:</strong> 09:00 - 18:00</p>
                  <p><strong>Sábado:</strong> 10:00 - 14:00</p>
                  <p><strong>Domingo:</strong> Fechado</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Época de IRS:</strong> Horário alargado durante março-junho
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Antes de Contactar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Consulte primeiro a nossa <a href="/faq" className="text-blue-600 hover:underline">página de FAQ</a></p>
                  <p>• Tenha os seus dados fiscais organizados</p>
                  <p>• Descreva o problema com detalhe</p>
                  <p>• Inclua capturas de ecrã se relevante</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envie-nos uma Mensagem</CardTitle>
                <p className="text-gray-600">
                  Preencha o formulário abaixo e responderemos o mais rapidamente possível.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="O seu nome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="o.seu.email@exemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="fiscal">Questões Fiscais</option>
                      <option value="bug">Reportar Bug</option>
                      <option value="feature">Sugestão de Funcionalidade</option>
                      <option value="geral">Questão Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Resumo da sua questão"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                      placeholder="Descreva a sua questão com o máximo de detalhe possível..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Importante:</p>
                        <p>
                          Não envie dados pessoais sensíveis (NIF, IBAN, etc.) através deste formulário. 
                          Para questões confidenciais, contacte-nos diretamente por email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        A enviar...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Precisa de Ajuda Imediata?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Para questões urgentes durante a época de IRS, pode também consultar 
                  os recursos oficiais da Autoridade Tributária e Aduaneira.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Portal das Finanças</h4>
                    <p className="text-sm text-gray-600">Linha de apoio oficial</p>
                    <p className="text-sm font-medium text-blue-600">217 206 707</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Serviços de Finanças</h4>
                    <p className="text-sm text-gray-600">Atendimento presencial</p>
                    <p className="text-sm text-blue-600">
                      <a href="https://www.at.gov.pt" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Encontrar serviço
                      </a>
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calculator className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Nossa Calculadora</h4>
                    <p className="text-sm text-gray-600">Experimente primeiro</p>
                    <p className="text-sm text-blue-600">
                      <a href="/calculadora" className="hover:underline">
                        Calcular IRS
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}