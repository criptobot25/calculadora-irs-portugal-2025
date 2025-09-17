'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Calculator, Sparkles, ArrowRight, Zap } from 'lucide-react'
import CalculatorWizard from '@/components/CalculatorWizard'
import AICalculatorChat from '@/components/AICalculatorChat'

export default function CalculadoraComIA() {
  const [mode, setMode] = useState<'choice' | 'ai' | 'traditional'>('choice')

  const handleDataExtracted = () => {
    // Data extraction handled by AI component
  }

  const handleSwitchToTraditional = () => {
    setMode('traditional')
  }

  if (mode === 'choice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como quer calcular o seu IRS?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha a forma mais conveniente para si: conversa com IA ou formulário tradicional
            </p>
          </div>

          {/* Choice Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* AI Mode */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-green-600 to-blue-600 text-white px-3 py-1 text-sm rounded-bl-lg">
                <Sparkles className="h-4 w-4 inline mr-1" />
                IA PRÓPRIA
              </div>
              
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  IA Especializada em IRS
                </CardTitle>
                <p className="text-gray-600">
                  Nossa própria IA especialista em fiscalidade portuguesa
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>100% Desenvolvida por Nós</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Especialista em IRS Português</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Escalões e Regras 2024/2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Sem dependências externas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Privacidade total dos dados</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-purple-800 italic">
                    💬 &quot;Ganho 2500€ mensais, sou casado e tenho 2 filhos&quot;
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    → IA própria entende fiscalidade portuguesa perfeitamente
                  </p>
                </div>

                <Button 
                  onClick={() => setMode('ai')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  Começar com IA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Traditional Mode */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Formulário Tradicional
                </CardTitle>
                <p className="text-gray-600">
                  Preencha os campos passo a passo como habitualmente
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Controlo total dos dados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Interface familiar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>4 passos organizados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Validação detalhada</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    📋 Formulário estruturado com campos específicos
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    → Ideal para quem prefere inserir dados manualmente
                  </p>
                </div>

                <Button 
                  onClick={() => setMode('traditional')}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  Usar Formulário
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">
                💡 Dica: Pode alternar entre os modos a qualquer momento
              </h3>
              <p className="text-sm text-gray-600">
                Ambos os métodos produzem os mesmos resultados precisos. 
                A escolha é apenas uma questão de preferência pessoal.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (mode === 'ai') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Calculadora IRS com IA
            </h1>
            <p className="text-gray-600">
              Converse naturalmente com o nosso assistente inteligente
            </p>
          </div>
          
          <AICalculatorChat 
            onDataExtracted={handleDataExtracted}
            onCalculationReady={handleSwitchToTraditional}
          />
          
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setMode('choice')}
              className="text-gray-600"
            >
              ← Voltar à escolha de modo
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CalculatorWizard />
      <div className="text-center mt-6">
        <Button 
          variant="ghost" 
          onClick={() => setMode('choice')}
          className="text-gray-600"
        >
          ← Voltar à escolha de modo
        </Button>
      </div>
    </div>
  )
}