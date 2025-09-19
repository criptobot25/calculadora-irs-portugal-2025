
// --- Robust, Modern Chat UI Implementation ---
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, Sparkles, FileText, Calculator, Lightbulb, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { HybridIntelligentAI } from "@/lib/hybridAI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  extractedData?: Record<string, unknown>;
  sources?: Array<{ title: string; url: string; snippet: string }>;
  mlInsights?: string[];
  error?: boolean;
  retry?: boolean;
}

interface AICalculatorChatProps {
  onDataExtracted: (data: Record<string, unknown>) => void;
  onCalculationReady: () => void;
}

export default function AICalculatorChat({ onDataExtracted, onCalculationReady }: AICalculatorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! 👋 Sou o seu assistente de IRS inteligente.\n\nPara começar, descreva a sua situação fiscal (ex: rendimento, estado civil, dependentes) e eu ajudo a calcular o imposto devido.",
      timestamp: new Date(),
      mlInsights: [
        "💡 Forneça informações como rendimento, estado civil e dependentes para uma análise completa."
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const aiAssistant = useRef<HybridIntelligentAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI only once
  useEffect(() => {
    if (!aiAssistant.current) aiAssistant.current = new HybridIntelligentAI();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Robust message processing with retry and error handling
  const processMessageWithRetry = useCallback(
    async (message: string, attempt: number = 1): Promise<any> => {
      const maxRetries = 3;
      try {
        const response = await aiAssistant.current!.processMessage(message);
        if (!response || typeof response.message !== "string") throw new Error("Resposta inválida da IA");
        return {
          ...response,
          confidence: typeof response.confidence === "number" ? response.confidence : 0.5,
          mlInsights: Array.isArray(response.mlInsights)
            ? response.mlInsights
            : ["💡 Resposta processada com sucesso"],
          extractedData:
            response.extractedData && typeof response.extractedData === "object"
              ? response.extractedData
              : {},
    error: !!(response as any)?.error
        };
      } catch (error) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          return processMessageWithRetry(message, attempt + 1);
        }
        return {
          message: `Desculpe, houve um problema técnico. Pode reformular a sua pergunta? (Tentativas: ${maxRetries})`,
          extractedData: {},
          confidence: 0.1,
          sources: [],
          mlInsights: [
            "⚠️ Ocorreu um erro temporário. Tente novamente ou reformule a pergunta."
          ],
          error: true
        };
      }
    },
    []
  );

  // Send message handler
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    setLastFailedMessage(null);
    try {
      const response = await processMessageWithRetry(currentInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        extractedData: response.extractedData,
        sources: response.sources,
        mlInsights: response.mlInsights,
        error: response.error || false
      };
      setMessages((prev) => [...prev, assistantMessage]);
      // Process extracted data if present
      if (!response.error && response.extractedData && Object.keys(response.extractedData).length > 0) {
        onDataExtracted(response.extractedData);
        if (response.confidence > 0.7) {
          setTimeout(() => {
            onCalculationReady();
          }, 1000);
        }
      }
      setRetryCount(0);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Ocorreu um erro inesperado. Por favor, recarregue a página ou tente novamente.",
        timestamp: new Date(),
        error: true,
        retry: true,
        mlInsights: [
          "⚠️ Erro do sistema. Recarregue a página se o problema persistir."
        ]
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLastFailedMessage(currentInput);
      setRetryCount((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, onDataExtracted, onCalculationReady, processMessageWithRetry]);

  // Retry last failed message
  const handleRetryLastMessage = useCallback(() => {
    if (lastFailedMessage && !isLoading) {
      setInputValue(lastFailedMessage);
      setLastFailedMessage(null);
    }
  }, [lastFailedMessage, isLoading]);

  // Keyboard send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat reiniciado. Como posso ajudar com o seu IRS?",
        timestamp: new Date(),
        mlInsights: ["🔄 Chat limpo. Descreva novamente a sua situação fiscal."]
      }
    ]);
    setRetryCount(0);
    setLastFailedMessage(null);
  };

  // Quick actions for user convenience
  const quickActions = [
    { text: "Trabalho por conta de outrem", icon: "💼" },
    { text: "Sou freelancer", icon: "💻" },
    { text: "Tenho rendimentos de arrendamento", icon: "🏠" },
    { text: "Sou reformado", icon: "👴" }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Bot className="h-6 w-6" />
            Assistente IA - IRS Portugal 2025
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardTitle>
          <div className="flex gap-2">
            {retryCount > 0 && (
              <Button
                onClick={handleRetryLastMessage}
                disabled={!lastFailedMessage || isLoading}
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-300"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Tentar Novamente
              </Button>
            )}
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
              Limpar Chat
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : message.error
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : message.error ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : message.error
                      ? "bg-red-50 text-red-900 border border-red-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.extractedData && Object.keys(message.extractedData).length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-green-700">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Dados extraídos:</span>
                      </div>
                      <pre className="text-green-600 text-xs mt-1 whitespace-pre-wrap">
                        {JSON.stringify(message.extractedData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {message.mlInsights && message.mlInsights.length > 0 && (
                    <div className={`mt-2 p-2 rounded text-sm ${
                      message.error
                        ? "bg-red-100 border border-red-300"
                        : "bg-purple-50 border border-purple-200"
                    }`}>
                      <div className={`flex items-center gap-1 ${
                        message.error ? "text-red-700" : "text-purple-700"
                      }`}>
                        <Lightbulb className="h-4 w-4" />
                        <span className="font-medium">
                          {message.error ? "Informação" : "Insights Inteligentes"}:
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {message.mlInsights.map((insight, idx) => (
                          <div key={idx} className={`text-xs ${message.error ? "text-red-600" : "text-purple-600"}`}>
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-blue-700">
                        <Calculator className="h-4 w-4" />
                        <span className="font-medium">Fontes adicionais:</span>
                      </div>
                      <div className="mt-1 space-y-1">
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
                  {message.retry && (
                    <div className="mt-2">
                      <Button
                        onClick={handleRetryLastMessage}
                        disabled={!lastFailedMessage || isLoading}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-300"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Tentar Novamente
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Analisando...</span>
                  </div>
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
        <div className="flex-shrink-0 border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <Input
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          {retryCount > 0 && (
            <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
              ⚠️ Ocorreram {retryCount} erro(s). Se o problema persistir, recarregue a página.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

