'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, User, Send, Sparkles, FileText, Calculator, Lightbulb, ExternalLink, TrendingUp } from 'lucide-react'
import { HybridIntelligentAI } from '@/lib/hybridAI'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  extractedData?: Record<string, unknown>
  sources?: Array<{title: string, url: string, snippet: string}>
  mlInsights?: string[]
}

interface AICalculatorChatProps {
  onDataExtracted: (data: Record<string, unknown>) => void
  onCalculationReady: () => void
}

export default function AICalculatorChat({ onDataExtracted, onCalculationReady }: AICalculatorChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiAssistant] = useState(() => new HybridIntelligentAI())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mensagem inicial
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Olá! 👋 Sou o seu assistente de IRS inteligente. 

Vou ajudá-lo a calcular o seu IRS de forma simples e conversacional. 

Para começar, pode me dizer:
• Qual é a sua situação profissional?
• Trabalha por conta de outrem, é freelancer, ou ambos?
• Tem outros rendimentos como arrendamentos?

Responda de forma natural, como se estivesse a falar com um amigo! 😊`,
      timestamp: new Date()
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await aiAssistant.processMessage(inputValue)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        extractedData: response.extractedData,
        sources: response.sources,
        mlInsights: response.mlInsights
      }

      setMessages(prev => [...prev, assistantMessage])

      // Se extraiu dados, passa para o componente pai
      if (response.extractedData && Object.keys(response.extractedData).length > 0) {
        onDataExtracted(response.extractedData)
      }

      // Se a confiança é alta, pode sugerir cálculo
      if (response.confidence > 0.7) {
        setTimeout(() => {
          const completeMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `✅ Tenho informações suficientes para calcular o seu IRS!

Gostaria de:
🔢 **Calcular agora** - Ver o resultado imediatamente
📋 **Revisar dados** - Verificar se tudo está correto
� **Continuar conversa** - Adicionar mais informações

O que prefere?`,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, completeMessage])
        }, 1000)
      }

    } catch (error) {
      console.error('Erro na IA:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Houve um problema temporário. Pode tentar novamente? 😅',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { text: "Trabalho por conta de outrem", icon: "💼" },
    { text: "Sou freelancer", icon: "💻" },
    { text: "Tenho rendimentos de arrendamento", icon: "🏠" },
    { text: "Sou reformado", icon: "👴" }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Assistente IRS com IA
            <Sparkles className="h-5 w-5 ml-auto animate-pulse" />
          </CardTitle>
          <p className="text-blue-100">
            Conversa natural para calcular o seu IRS automaticamente
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] p-3 rounded-lg whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-12'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                  
                  {message.extractedData && Object.keys(message.extractedData).length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-green-700">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Dados extraídos:</span>
                      </div>
                      <pre className="text-green-600 text-xs mt-1">
                        {JSON.stringify(message.extractedData, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {message.mlInsights && message.mlInsights.length > 0 && (
                    <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-purple-700">
                        <Lightbulb className="h-4 w-4" />
                        <span className="font-medium">Insights Inteligentes:</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {message.mlInsights.map((insight, idx) => (
                          <div key={idx} className="text-purple-600 text-xs">
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-blue-700">
                        <ExternalLink className="h-4 w-4" />
                        <span className="font-medium">Fontes Web:</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="text-blue-600 text-xs">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              📄 {source.title}
                            </a>
                            <p className="text-gray-600 mt-1">{source.snippet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (only show initially) */}
          {messages.length <= 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Respostas rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(action.text)}
                    className="text-xs"
                  >
                    {action.icon} {action.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite a sua resposta... (Ex: 'Ganho 2500 euros por mês')"
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                💡 Fale naturalmente: &quot;Ganho 30 mil por ano&quot; ou &quot;Gastei 500€ em médicos&quot;
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                <span>IA Híbrida: Local + ML + Web</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCalculationReady}
                className="text-xs"
              >
                <Calculator className="h-3 w-3 mr-1" />
                Modo Tradicional
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}