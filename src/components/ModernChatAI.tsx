'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  FileText, 
  Calculator, 
  Lightbulb, 
  ExternalLink, 
  TrendingUp,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Clock
} from 'lucide-react'
import { HybridIntelligentAI } from '@/lib/hybridAI'
import './ModernChatAI.css'

// Tipos modernos e seguros
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'error'
  extractedData?: Record<string, unknown>
  sources?: Array<{title: string, url: string, snippet: string}>
  mlInsights?: string[]
  retryCount?: number
}

interface ModernChatAIProps {
  onDataExtracted: (data: Record<string, unknown>) => void
  onCalculationReady: () => void
  className?: string
}

// Configurações do chat
const CHAT_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_MESSAGE_LENGTH: 2000,
  TYPING_INDICATOR_DELAY: 500,
  AUTO_SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior
}

// Hook personalizado para gerenciar mensagens
const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: message.role === 'user' ? 'sending' : 'delivered'
    }
    
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])
  
  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ))
  }, [])
  
  const retryMessage = useCallback((id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id 
        ? { ...msg, status: 'sending' as const, retryCount: (msg.retryCount || 0) + 1 }
        : msg
    ))
  }, [])
  
  return { messages, addMessage, updateMessage, retryMessage }
}

// Hook para gerenciar estado de carregamento
const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  
  const startLoading = useCallback((message = 'Processando...') => {
    setIsLoading(true)
    setLoadingMessage(message)
  }, [])
  
  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingMessage('')
  }, [])
  
  return { isLoading, loadingMessage, startLoading, stopLoading }
}

// Componente de indicador de digitação
const TypingIndicator: React.FC = () => (
  <div className="flex gap-3 justify-start animate-fade-in">
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
      <Bot className="h-5 w-5 text-blue-600" />
    </div>
    <div className="bg-gray-100 p-3 rounded-lg">
      <div className="flex space-x-1">
        {[0, 1, 2].map(i => (
          <div 
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  </div>
)

// Componente de status da mensagem
const MessageStatus: React.FC<{ status: ChatMessage['status'] }> = ({ status }) => {
  const statusConfig = {
    sending: { icon: Clock, color: 'text-gray-400', label: 'Enviando...' },
    sent: { icon: CheckCircle, color: 'text-blue-400', label: 'Enviado' },
    delivered: { icon: CheckCircle, color: 'text-green-400', label: 'Entregue' },
    error: { icon: AlertCircle, color: 'text-red-400', label: 'Erro' }
  }
  
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <div className={`flex items-center gap-1 text-xs ${config.color}`} title={config.label}>
      <Icon className="h-3 w-3" />
    </div>
  )
}

// Componente principal do chat
export default function ModernChatAI({ onDataExtracted, onCalculationReady, className = '' }: ModernChatAIProps) {
  const { messages, addMessage, updateMessage, retryMessage } = useChatMessages()
  const { isLoading, loadingMessage, startLoading, stopLoading } = useLoadingState()
  const [inputValue, setInputValue] = useState('')
  const [aiAssistant] = useState(() => new HybridIntelligentAI())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Ações rápidas configuráveis
  const quickActions = useMemo(() => [
    { text: "Trabalho por conta de outrem", icon: "💼", category: "profissao" },
    { text: "Sou freelancer", icon: "💻", category: "profissao" },
    { text: "Tenho rendimentos de arrendamento", icon: "🏠", category: "rendimentos" },
    { text: "Sou reformado", icon: "👴", category: "profissao" }
  ], [])
  
  // Inicialização do chat
  useEffect(() => {
    addMessage({
      role: 'assistant',
      content: `Olá! 👋 Sou o seu assistente de IRS inteligente.

Vou ajudá-lo a calcular o seu IRS de forma simples e conversacional.

Para começar, pode me dizer:
• Qual é a sua situação profissional?
• Trabalha por conta de outrem, é freelancer, ou ambos?
• Tem outros rendimentos como arrendamentos?

Responda de forma natural, como se estivesse a falar com um amigo! 😊`
    })
  }, [addMessage])
  
  // Auto-scroll para última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: CHAT_CONFIG.AUTO_SCROLL_BEHAVIOR 
      })
    }
  }, [messages, isLoading])
  
  // Função para processar mensagem com retry automático
  const processMessageWithRetry = useCallback(async (
    messageContent: string, 
    messageId: string, 
    retryCount = 0
  ): Promise<void> => {
    try {
      startLoading('Analisando a sua mensagem...')
      
      const response = await aiAssistant.processMessage(messageContent)
      
      const assistantMessageId = addMessage({
        role: 'assistant',
        content: response.message,
        extractedData: response.extractedData,
        sources: response.sources,
        mlInsights: response.mlInsights
      })
      
      // Atualizar status da mensagem do usuário para sucesso
      updateMessage(messageId, { status: 'delivered' })
      
      // Processar dados extraídos
      if (response.extractedData && Object.keys(response.extractedData).length > 0) {
        onDataExtracted(response.extractedData)
      }
      
      // Sugerir cálculo se confiança alta
      if (response.confidence > 0.7) {
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: `✅ Tenho informações suficientes para calcular o seu IRS!

Gostaria de:
🔢 **Calcular agora** - Ver o resultado imediatamente
📋 **Revisar dados** - Verificar se tudo está correto
💬 **Continuar conversa** - Adicionar mais informações

O que prefere?`
          })
        }, 1000)
      }
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error)
      
      // Tentar novamente se não excedeu limite
      if (retryCount < CHAT_CONFIG.MAX_RETRIES) {
        setTimeout(() => {
          processMessageWithRetry(messageContent, messageId, retryCount + 1)
        }, CHAT_CONFIG.RETRY_DELAY * (retryCount + 1))
        
        updateMessage(messageId, { 
          status: 'sending',
          retryCount: retryCount + 1
        })
        
        return
      }
      
      // Falhou após todas as tentativas
      updateMessage(messageId, { status: 'error' })
      
      addMessage({
        role: 'assistant',
        content: `😅 Houve um problema técnico. 

Pode tentar:
• Reformular a sua pergunta
• Usar termos mais simples
• Clicar no botão ↻ para tentar novamente

Estou aqui para ajudar!`
      })
    } finally {
      stopLoading()
    }
  }, [aiAssistant, addMessage, updateMessage, onDataExtracted, startLoading, stopLoading])
  
  // Enviar mensagem
  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim()
    
    if (!trimmedInput || isLoading) return
    if (trimmedInput.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      alert(`Mensagem muito longa. Máximo ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} caracteres.`)
      return
    }
    
    const messageId = addMessage({
      role: 'user',
      content: trimmedInput
    })
    
    setInputValue('')
    
    // Pequeno delay para mostrar indicador de digitação
    setTimeout(() => {
      processMessageWithRetry(trimmedInput, messageId)
    }, CHAT_CONFIG.TYPING_INDICATOR_DELAY)
    
  }, [inputValue, isLoading, addMessage, processMessageWithRetry])
  
  // Repetir mensagem com erro
  const handleRetryMessage = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return
    
    retryMessage(messageId)
    processMessageWithRetry(message.content, messageId)
  }, [messages, retryMessage, processMessageWithRetry])
  
  // Manipular teclas
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])
  
  // Selecionar ação rápida
  const handleQuickAction = useCallback((actionText: string) => {
    setInputValue(actionText)
    inputRef.current?.focus()
  }, [])
  
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="h-[600px] flex flex-col shadow-lg">
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
          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
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
                
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className={`message-bubble p-3 rounded-lg whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'user-message text-white ml-12'
                        : 'assistant-message text-gray-900'
                    }`}
                  >
                    {message.content}
                    
                    {/* Dados extraídos */}
                    {message.extractedData && Object.keys(message.extractedData).length > 0 && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <div className="flex items-center gap-1 text-green-700">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">Dados extraídos:</span>
                        </div>
                        <pre className="text-green-600 text-xs mt-1 overflow-x-auto">
                          {JSON.stringify(message.extractedData, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {/* Insights ML */}
                    {message.mlInsights && message.mlInsights.length > 0 && (
                      <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-sm">
                        <div className="flex items-center gap-1 text-purple-700">
                          <Lightbulb className="h-4 w-4" />
                          <span className="font-medium">Insights Inteligentes:</span>
                        </div>
                        <div className="mt-1 space-y-1">
                          {message.mlInsights.map((insight, idx) => (
                            <div key={idx} className="text-purple-600 text-xs">
                              • {insight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Fontes web */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                        <div className="flex items-center gap-1 text-blue-700">
                          <ExternalLink className="h-4 w-4" />
                          <span className="font-medium">Fontes Web:</span>
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
                                📄 {source.title}
                              </a>
                              <p className="text-gray-600 mt-1">{source.snippet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Status e ações da mensagem */}
                  <div className="flex items-center justify-between">
                    <MessageStatus status={message.status} />
                    
                    {message.status === 'error' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRetryMessage(message.id)}
                        className="text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Tentar novamente
                      </Button>
                    )}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Indicador de digitação */}
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Ações rápidas */}
          {messages.length <= 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Respostas rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.text)}
                    className="text-xs hover:bg-blue-50"
                  >
                    {action.icon} {action.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Área de input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite a sua resposta... (Ex: 'Ganho 2500 euros por mês')"
                disabled={isLoading}
                className="flex-1"
                maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                💡 Fale naturalmente: "Ganho 30 mil por ano" ou "Gastei 500€ em médicos"
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
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
            
            {isLoading && loadingMessage && (
              <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                <RefreshCw className="h-3 w-3 animate-spin" />
                {loadingMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}