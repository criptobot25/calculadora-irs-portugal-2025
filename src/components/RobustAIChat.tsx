'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, User, Send, Sparkles, FileText, Calculator, Lightbulb, AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import { HybridIntelligentAI } from '@/lib/hybridAI'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  extractedData?: Record<string, unknown>
  sources?: Array<{title: string, url: string, snippet: string}>
  mlInsights?: string[]
  error?: boolean
  retry?: boolean
}

interface AICalculatorChatProps {
  onDataExtracted: (data: Record<string, unknown>) => void
  onCalculationReady: () => void
}

export default function AICalculatorChat({ onDataExtracted, onCalculationReady }: AICalculatorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o seu assistente inteligente para cálculos de IRS. Descreva a sua situação fiscal e eu ajudo-o a calcular o imposto devido.',
      timestamp: new Date(),
      mlInsights: ['💡 Forneça informações como rendimento, estado civil e dependentes para uma análise completa']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const [aiAssistant] = useState(() => new HybridIntelligentAI())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const processMessageWithRetry = async (message: string, attempt = 1): Promise<void> => {
    const maxRetries = 3
    
    try {
      const response = await aiAssistant.processMessage(message)
      
      // Validar resposta
      if (!response || !response.message) {
        throw new Error('Resposta inválida da IA')
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
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
          onCalculationReady()
        }, 2000)
      }

      // Reset retry count on success
      setRetryCount(0)
      setLastFailedMessage(null)

    } catch (error) {
      console.error('Erro no processamento da mensagem:', error)
      
      if (attempt < maxRetries) {
        console.log(`Tentativa ${attempt + 1}/${maxRetries}...`)
        setRetryCount(attempt)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Delay crescente
        return processMessageWithRetry(message, attempt + 1)
      }

      // Falhou todas as tentativas
      setRetryCount(maxRetries)
      setLastFailedMessage(message)
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Desculpe, houve um problema temporário. Pode tentar reformular a sua pergunta ou usar o botão de repetir.',
        timestamp: new Date(),
        error: true,
        retry: true,
        mlInsights: ['🔄 Clique em "Tentar Novamente" ou reformule a pergunta']
      }

      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      await processMessageWithRetry(inputValue.trim())
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async () => {
    if (!lastFailedMessage || isLoading) return
    
    setIsLoading(true)
    try {
      await processMessageWithRetry(lastFailedMessage)
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

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Olá! Sou o seu assistente inteligente para cálculos de IRS. Descreva a sua situação fiscal e eu ajudo-o a calcular o imposto devido.',
        timestamp: new Date(),
        mlInsights: ['💡 Forneça informações como rendimento, estado civil e dependentes para uma análise completa']
      }
    ])
    setInputValue('')
    setRetryCount(0)
    setLastFailedMessage(null)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Assistente IA para IRS
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetChat}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
        
        {retryCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="h-4 w-4" />
            {retryCount < 3 ? `Tentativa ${retryCount}/3...` : 'Falha após 3 tentativas'}
            {lastFailedMessage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isLoading}
                className="ml-auto"
              >
                Tentar Novamente
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex gap-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.error
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : message.error ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={`rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.error
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.extractedData && Object.keys(message.extractedData).length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-green-700">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Dados extraídos:</span>
                      </div>
                      <div className="text-green-600 text-xs mt-1 font-mono">
                        {Object.entries(message.extractedData).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </div>
                        ))}
                      </div>
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
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">Fontes:</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="text-blue-600 text-xs">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {source.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.retry && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Tentar Novamente
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Descreva a sua situação fiscal (ex: Sou enfermeiro, ganho 30000€ por ano, casado com 2 filhos)"
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-2 text-center">
          <Calculator className="h-3 w-3 inline mr-1" />
          IA híbrida com análise local + web search • 100% gratuita
        </div>
      </CardContent>
    </Card>
  )
}