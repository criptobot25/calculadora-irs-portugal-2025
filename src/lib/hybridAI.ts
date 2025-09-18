// lib/hybridAI.ts - IA Híbrida com Machine Learning e Acesso à Internet
import { CustomIRSAI, IRSData } from './customIRS_AI'

interface WebSearchResult {
  title: string
  url: string
  snippet: string
  date?: string
}

interface AIResponse {
  message: string
  extractedData: Partial<IRSData>
  confidence: number
  sources?: WebSearchResult[]
  mlInsights?: string[]
}

export class HybridIntelligentAI {
  private localIRS: CustomIRSAI
  // Usar APIs gratuitas sem chave
  private searchAPI = 'https://duckduckgo-api.vercel.app/search' // API gratuita sem chave
  private freeMLAPI = 'https://api.openai.com/v1/chat/completions' // Será substituída por lógica local

  constructor() {
    this.localIRS = new CustomIRSAI()
  }

  async processMessage(userMessage: string): Promise<AIResponse> {
    // 1. PROCESSAMENTO LOCAL (base confiável)
    const localResponse = await this.localIRS.processMessage(userMessage)
    
    // 2. ANÁLISE INTELIGENTE COM ML
    const mlInsights = await this.analyzeWithML(userMessage, localResponse.extractedData || {})
    
    // 3. BUSCA CONTEXTUAL NA INTERNET (se necessário)
    const webResults = await this.searchRelevantInfo(userMessage)
    
    // 4. COMBINAÇÃO INTELIGENTE
    const enhancedMessage = await this.enhanceResponse(
      localResponse.message,
      mlInsights,
      webResults,
      userMessage
    )

    return {
      message: enhancedMessage,
      extractedData: localResponse.extractedData || {},
      confidence: localResponse.confidence,
      sources: webResults,
      mlInsights
    }
  }

  private async analyzeWithML(message: string, extractedData: Partial<IRSData>): Promise<string[]> {
    // IA LOCAL sem APIs externas - 100% gratuita
    return this.generateLocalInsights(message, extractedData)
  }

  private async searchRelevantInfo(message: string): Promise<WebSearchResult[]> {
    try {
      // Detectar se precisa de informações atualizadas
      const needsWebSearch = this.shouldSearchWeb(message)
      if (!needsWebSearch) return []

      const searchQuery = this.generateSearchQuery(message)
      
      // Usar API gratuita de search (Brave, DuckDuckGo, etc.)
      const response = await fetch(`https://duckduckgo-api.vercel.app/search?q=${encodeURIComponent(searchQuery)}`)
      
      if (response.ok) {
        const data = await response.json()
        return this.formatSearchResults(data.results || [])
      }
    } catch (error) {
      console.log('Web search optional - continuing without web results')
    }
    
    return []
  }

  private shouldSearchWeb(message: string): boolean {
    const webTriggers = [
      'taxa atual', 'novo', '2025', 'mudança', 'atualização',
      'governo', 'orçamento', 'lei', 'decreto', 'regulamento'
    ]
    return webTriggers.some(trigger => message.toLowerCase().includes(trigger))
  }

  private generateSearchQuery(message: string): string {
    if (message.includes('taxa')) return 'taxa IRS Portugal 2025'
    if (message.includes('dedução')) return 'deduções IRS Portugal 2025'
    if (message.includes('escalão')) return 'escalões IRS Portugal 2025'
    return 'IRS Portugal 2025 novidades'
  }

  private formatSearchResults(results: Array<{title: string, url: string, description?: string, snippet?: string, date?: string}>): WebSearchResult[] {
    return results.slice(0, 3).map((result) => ({
      title: result.title || '',
      url: result.url || '',
      snippet: result.description || result.snippet || '',
      date: result.date
    }))
  }

  private extractInsights(mlText: string): string[] {
    // Extrair insights úteis do texto gerado por ML
    const insights = []
    
    if (mlText.includes('dedução') || mlText.includes('poupança')) {
      insights.push('💡 Considere maximizar deduções para reduzir IRS')
    }
    
    if (mlText.includes('escalão') || mlText.includes('taxa')) {
      insights.push('📊 Sua taxa marginal pode impactar decisões financeiras')
    }
    
    if (mlText.includes('planejamento') || mlText.includes('otimização')) {
      insights.push('🎯 Planejamento fiscal pode gerar poupanças significativas')
    }
    
    return insights.length > 0 ? insights : this.generateLocalInsights('', {})
  }

  private generateLocalInsights(message: string, data: Partial<IRSData>): string[] {
    const insights = []
    
    // Insights baseados em rendimento
    if (data.employmentIncome && data.employmentIncome > 50000) {
      insights.push('💰 Com rendimento alto, considere PPR para reduzir IRS')
    }
    
    if (data.employmentIncome && data.employmentIncome < 20000) {
      insights.push('💡 Com rendimento baixo, pode ter direito a deduções especiais')
    }
    
    // Insights baseados em estado civil
    if (data.civilStatus === 'married') {
      insights.push('👫 Casados podem escolher tributação conjunta ou separada')
      insights.push('💍 Cônjuge também gera dedução de 4.104€')
    }
    
    if (data.civilStatus === 'single' && data.dependents && data.dependents > 0) {
      insights.push('👨‍👩‍👧‍👦 Como pai/mãe solteiro(a), tem deduções especiais')
    }
    
    // Insights baseados em despesas
    if (!data.healthExpenses) {
      insights.push('🏥 Não se esqueça de guardar faturas médicas para dedução')
    }
    
    if (!data.educationExpenses && data.dependents && data.dependents > 0) {
      insights.push('📚 Despesas de educação dos filhos são dedutíveis (até 800€)')
    }
    
    // Insights baseados na mensagem
    if (message.includes('freelancer') || message.includes('independente')) {
      insights.push('� Trabalho independente: considere abrir atividade para deduções')
    }
    
    if (message.includes('casa') || message.includes('habitação')) {
      insights.push('🏠 Crédito habitação própria gera deduções até 591€')
    }
    
    if (message.includes('médico') || message.includes('saúde')) {
      insights.push('🩺 Despesas de saúde são 100% dedutíveis até 1.000€')
    }
    
    // Insights inteligentes por faixa de rendimento
    if (data.employmentIncome) {
      const income = data.employmentIncome
      if (income > 80000) {
        insights.push('📈 Rendimento no escalão máximo (48%) - otimização é crucial')
      } else if (income > 36000) {
        insights.push('📊 No escalão de 35% - cada dedução tem impacto significativo')
      } else if (income > 20000) {
        insights.push('⚖️ Em escalão intermédio - equilíbrio entre imposto e deduções')
      }
    }
    
    return insights.length > 0 ? insights.slice(0, 3) : [
      '💡 Complete os dados para receber insights personalizados',
      '🎯 Cada euro em deduções reduz diretamente o seu IRS',
      '📱 Nossa IA analisa sua situação em tempo real'
    ]
  }

  private async enhanceResponse(
    originalMessage: string,
    mlInsights: string[],
    webResults: WebSearchResult[],
    userMessage: string
  ): Promise<string> {
    let enhanced = originalMessage

    // Adicionar insights de ML se relevantes
    if (mlInsights.length > 0) {
      enhanced += `\n\n🤖 **Insights Inteligentes:**\n${mlInsights.join('\n')}`
    }

    // Adicionar informações da web se encontradas
    if (webResults.length > 0) {
      enhanced += `\n\n🌐 **Informações Atualizadas:**\n`
      webResults.forEach(result => {
        enhanced += `• [${result.title}](${result.url})\n  ${result.snippet}\n`
      })
    }

    // Usar ML para melhorar a resposta (opcional)
    try {
      const refinedResponse = await this.refineWithML(enhanced, userMessage)
      return refinedResponse || enhanced
    } catch {
      return enhanced
    }
  }

  private async refineWithML(response: string, userMessage: string): Promise<string | null> {
    // IA LOCAL - sem APIs externas
    // Usar regras inteligentes para melhorar resposta
    let refined = response
    
    // Adicionar contexto baseado em palavras-chave
    if (userMessage.includes('quanto')) {
      refined += '\n\n💡 Dica: O valor final pode variar com deduções!'
    }
    
    if (userMessage.includes('casado') || userMessage.includes('cônjuge')) {
      refined += '\n\n👫 Lembre-se: Casais podem optar por tributação conjunta ou separada.'
    }
    
    if (userMessage.includes('filho') || userMessage.includes('dependente')) {
      refined += '\n\n👶 Dependentes geram deduções significativas!'
    }
    
    return refined !== response ? refined : null
  }

  // Método para treinar com feedback do usuário
  async learnFromFeedback(userMessage: string, feedback: 'positive' | 'negative', context?: string) {
    // Implementar aprendizado baseado em feedback
    // Pode usar local storage ou enviar para backend para ML training
    const learningData = {
      message: userMessage,
      feedback,
      context,
      timestamp: new Date().toISOString()
    }
    
    // Armazenar localmente para análise de padrões
    const existing = localStorage.getItem('ai_learning_data')
    const data = existing ? JSON.parse(existing) : []
    data.push(learningData)
    localStorage.setItem('ai_learning_data', JSON.stringify(data.slice(-100))) // Manter últimos 100
  }

  // Método para obter estatísticas de aprendizado
  getLearningStats() {
    try {
      const data: Array<{feedback: string}> = JSON.parse(localStorage.getItem('ai_learning_data') || '[]')
      const positive = data.filter((item) => item.feedback === 'positive').length
      const negative = data.filter((item) => item.feedback === 'negative').length
      
      return {
        total: data.length,
        positive,
        negative,
        accuracy: data.length > 0 ? (positive / data.length * 100).toFixed(1) : '0'
      }
    } catch {
      return { total: 0, positive: 0, negative: 0, accuracy: '0' }
    }
  }
}