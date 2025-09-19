'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  // Estados principais
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'reconnecting'>('connected')
  
  // Instância da IA
  const [aiAssistant] = useState(() => new HybridIntelligentAI())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll automático para a última mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Foco automático no input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Função para processar mensagem com retry automático
  const processMessageWithRetry = async (message: string, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        setConnectionStatus('connected')
        const response = await aiAssistant.processMessage(message)
        
        // Validação da resposta
        if (!response || !response.message) {
          throw new Error('Resposta inválida da IA')
        }
        
        setRetryCount(0)
        return response
        
      } catch (error) {
        console.error(`Tentativa ${i + 1} falhou:`, error)
        
        if (i === retries - 1) {
          setConnectionStatus('error')
          throw error
        }
        
        setConnectionStatus('reconnecting')
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  // Função principal para enviar mensagem
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue.trim()
    setInputValue('')
    setIsLoading(true)
    setLastFailedMessage(null)

    try {
      // Processar com retry automático
      const response = await processMessageWithRetry(currentInput)
      
      // Criar mensagem da IA
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

      // Extrair dados se disponíveis
      if (response.extractedData && Object.keys(response.extractedData).length > 0) {
        onDataExtracted(response.extractedData)
        
        // Sugerir cálculo se confiança alta
        if (response.confidence > 0.7) {
          setTimeout(() => {
            const suggestionMessage: Message = {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: '✨ Dados extraídos com sucesso! Gostaria de calcular o seu IRS agora?',
              timestamp: new Date(),
              mlInsights: ['🧮 Clique no botão "Calcular IRS" para ver o resultado']
            }
            setMessages(prev => [...prev, suggestionMessage])
            onCalculationReady()
          }, 1500)
        }
      }

    } catch (error) {
      console.error('Erro no chat:', error)
      
      // Mensagem de erro amigável
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, houve um problema temporário. Pode tentar reformular a sua pergunta?',
        timestamp: new Date(),
        error: true,
        retry: true,
        mlInsights: ['🔧 Erro temporário - tente novamente', '💡 Verifique se forneceu informações claras sobre a sua situação fiscal']
      }

      setMessages(prev => [...prev, errorMessage])
      setLastFailedMessage(currentInput)
      setRetryCount(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para retry manual
  const handleRetry = () => {
    if (lastFailedMessage) {
      setInputValue(lastFailedMessage)
      setLastFailedMessage(null)
      inputRef.current?.focus()
    }
  }

  // Função para limpar chat
  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chat reiniciado! Como posso ajudar com o seu IRS?',
        timestamp: new Date(),
        mlInsights: ['💡 Descreva a sua situação fiscal para começar']
      }
    ])
    setInputValue('')
    setLastFailedMessage(null)
    setRetryCount(0)
    setConnectionStatus('connected')
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Render status indicator
  const renderStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
        )
      case 'reconnecting':
        return (
          <div className="flex items-center gap-1 text-yellow-600 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Reconectando...</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Erro de conexão</span>
          </div>
        )
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>Assistente IRS</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardTitle>
          <div className="flex items-center gap-2">
            {renderStatusIndicator()}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.error
                    ? 'bg-red-50 border border-red-200 text-red-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Extracted Data */}
                {message.extractedData && Object.keys(message.extractedData).length > 0 && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="flex items-center gap-1 text-green-700 mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Dados extraídos:</span>
                    </div>
                    <div className="text-green-600 text-xs">
                      {Object.entries(message.extractedData).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* ML Insights */}
                {message.mlInsights && message.mlInsights.length > 0 && (
                  <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-sm">
                    <div className="flex items-center gap-1 text-purple-700 mb-1">
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">Insights Inteligentes:</span>
                    </div>
                    <div className="space-y-1">
                      {message.mlInsights.map((insight, idx) => (
                        <div key={idx} className="text-purple-600 text-xs">
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <div className="flex items-center gap-1 text-blue-700 mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Fontes:</span>
                    </div>
                    <div className="space-y-1">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="text-blue-600 text-xs">
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {source.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retry Button for Error Messages */}
                {message.retry && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Tentar novamente
                    </Button>
                  </div>
                )}
                
                {/* Timestamp */}
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('pt-PT', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Descreva a sua situação fiscal... (ex: Sou enfermeiro, ganho 30000€ anuais, casado com 2 filhos)"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setInputValue('Sou enfermeiro e ganho 30000 euros por ano')}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              💼 Exemplo: Enfermeiro
            </button>
            <button
              onClick={() => setInputValue('Sou casado, 2 filhos, ganho 45000 euros')}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              👨‍👩‍👧‍👦 Exemplo: Família
            </button>
            <button
              onClick={() => setInputValue('Freelancer, 60000 euros por ano')}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              🔧 Exemplo: Freelancer
            </button>
          </div>
          
          {retryCount > 0 && (
            <div className="text-xs text-amber-600 mt-1">
              ⚠️ {retryCount} erro(s) de conexão. A IA pode estar sobrecarregada.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}