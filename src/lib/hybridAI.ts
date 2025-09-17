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
  private searchAPI = 'https://api.search.brave.com/res/v1/web/search' // API gratuita Brave Search
  private mlAPI = 'https://api-inference.huggingface.co/models/' // Hugging Face gratuito

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
    try {
      // Usar modelos gratuitos do Hugging Face para análise semântica
      const analysisPrompt = `Analise esta mensagem sobre IRS português e forneça insights:
      Mensagem: "${message}"
      Dados extraídos: ${JSON.stringify(extractedData)}
      
      Forneça 3 insights úteis sobre situação fiscal em português:`

      const response = await fetch(`${this.mlAPI}microsoft/DialoGPT-medium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: analysisPrompt,
          parameters: { max_length: 200, temperature: 0.7 }
        })
      })

      if (response.ok) {
        const result = await response.json()
        const insights = this.extractInsights(result[0]?.generated_text || '')
        return insights
      }
    } catch (error) {
      console.log('ML analysis optional - continuing with local AI')
    }
    
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
    
    if (data.employmentIncome && data.employmentIncome > 50000) {
      insights.push('💰 Com rendimento alto, considere PPR para reduzir IRS')
    }
    
    if (!data.healthExpenses) {
      insights.push('🏥 Não se esqueça de guardar faturas médicas para dedução')
    }
    
    if (data.civilStatus === 'married') {
      insights.push('👫 Casados podem escolher tributação conjunta ou separada')
    }
    
    return insights
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
    try {
      const prompt = `Melhore esta resposta sobre IRS português, mantendo precisão técnica:
      
      Pergunta: ${userMessage}
      Resposta atual: ${response}
      
      Resposta melhorada:`

      const mlResponse = await fetch(`${this.mlAPI}microsoft/DialoGPT-medium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_length: 300, temperature: 0.6 }
        })
      })

      if (mlResponse.ok) {
        const result = await mlResponse.json()
        return result[0]?.generated_text?.replace(prompt, '').trim()
      }
    } catch (error) {
      console.log('ML refinement optional - using original response')
    }
    
    return null
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