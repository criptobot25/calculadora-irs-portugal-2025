// lib/aiAssistant.ts - IA Gratuita com Google Gemini
interface IRSData {
  employmentIncome?: number
  businessIncome?: number
  healthExpenses?: number
  educationExpenses?: number
  civilStatus?: string
  dependents?: number
}

export class IRSAIAssistant {
  private apiKey: string
  private conversationHistory: Array<{role: string, content: string}> = []

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.initializeConversation()
  }

  private initializeConversation() {
    this.conversationHistory = [{
      role: "user",
      content: `Você é um assistente especializado em IRS português. Sua função é:
      1. Fazer perguntas simples e naturais para obter dados fiscais
      2. Extrair números de respostas em linguagem natural
      3. Sugerir deduções baseadas no perfil do usuário
      4. Explicar conceitos fiscais de forma simples
      5. Sempre responder em português de Portugal
      
      Dados que precisa obter:
      - Rendimentos (Categoria A, B, E, F)
      - Estado civil e dependentes
      - Despesas dedutíveis (saúde, educação, habitação)
      - Regime fiscal preferido
      
      Seja conversacional, amigável e eficiente.`
    }]
  }

  async processUserMessage(message: string): Promise<{
    response: string
    extractedData?: Partial<IRSData>
    isComplete?: boolean
  }> {
    this.conversationHistory.push({
      role: "user",
      content: message
    })

    try {
      // Usar Google Gemini API (gratuita)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: this.buildPrompt(message)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      })

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0]) {
        throw new Error('Resposta inválida da API')
      }

      const assistantResponse = data.candidates[0].content.parts[0].text

      this.conversationHistory.push({
        role: "assistant", 
        content: assistantResponse
      })

      // Extrair dados estruturados da conversa
      const extractedData = this.extractStructuredData(assistantResponse)
      const isComplete = this.checkIfDataComplete(extractedData)

      return {
        response: assistantResponse,
        extractedData,
        isComplete
      }

    } catch (error) {
      console.error('AI Assistant Error:', error)
      // Fallback para resposta local se API falhar
      return this.getLocalFallbackResponse(message)
    }
  }

  private buildPrompt(userMessage: string): string {
    const context = this.conversationHistory.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n')
    
    return `${context}\nuser: ${userMessage}\n\nResponda como assistente de IRS português, sendo natural e extraindo dados fiscais relevantes.`
  }

  private getLocalFallbackResponse(message: string): {
    response: string
    extractedData?: Partial<IRSData>
    isComplete?: boolean
  } {
    // Sistema local básico de processamento
    const lowerMessage = message.toLowerCase()
    
    // Detectar rendimentos
    const salaryPattern = /(?:salário|ganho|ordenado).*?(\d+(?:[.,]\d+)?)/i
    const salaryMatch = message.match(salaryPattern)
    
    let response = ""
    const extractedData: Partial<IRSData> = {}
    
    if (salaryMatch) {
      const amount = parseFloat(salaryMatch[1].replace(',', '.'))
      extractedData.employmentIncome = amount
      response = `Entendi que tem um salário de €${amount}. Tem outras fontes de rendimento como rendas, dividendos ou atividade empresarial?`
    } else if (lowerMessage.includes('saúde') || lowerMessage.includes('médic')) {
      const healthPattern = /(\d+(?:[.,]\d+)?)/
      const healthMatch = message.match(healthPattern)
      if (healthMatch) {
        extractedData.healthExpenses = parseFloat(healthMatch[1].replace(',', '.'))
        response = `Registei €${extractedData.healthExpenses} em despesas de saúde. Tem despesas de educação ou habitação?`
      } else {
        response = "Que valor gastou aproximadamente em saúde no último ano?"
      }
    } else if (lowerMessage.includes('solteiro') || lowerMessage.includes('casado')) {
      extractedData.civilStatus = lowerMessage.includes('casado') ? 'married' : 'single'
      response = "Tem filhos ou outros dependentes a cargo?"
    } else {
      response = "Olá! Vou ajudá-lo com o cálculo do IRS. Para começar, qual é o seu salário anual bruto?"
    }

    return {
      response,
      extractedData,
      isComplete: false
    }
  }

  private extractStructuredData(text: string): Partial<IRSData> {
    // Patterns mais robustos para extrair números e dados
    const patterns = {
      salary: /(?:salário|ganho|ordenado|vencimento|rendimento).*?(\d+(?:[.,]\d+)?)/i,
      business: /(?:negócio|empresa|atividade).*?(\d+(?:[.,]\d+)?)/i,
      health: /(?:saúde|médic|farmácia|hospital).*?(\d+(?:[.,]\d+)?)/i,
      education: /(?:educação|escola|universidade|formação).*?(\d+(?:[.,]\d+)?)/i,
      dependents: /(?:dependentes|filhos|crianças).*?(\d+)/i,
      married: /(?:casado|casada|cônjuge|esposa|marido)/i,
      single: /(?:solteiro|solteira)/i
    }

    const extracted: Partial<IRSData> = {}

    // Extrair valores monetários
    const salaryMatch = text.match(patterns.salary)
    if (salaryMatch) {
      extracted.employmentIncome = this.parseAmount(salaryMatch[1])
    }

    const businessMatch = text.match(patterns.business)
    if (businessMatch) {
      extracted.businessIncome = this.parseAmount(businessMatch[1])
    }

    const healthMatch = text.match(patterns.health)
    if (healthMatch) {
      extracted.healthExpenses = this.parseAmount(healthMatch[1])
    }

    const educationMatch = text.match(patterns.education)
    if (educationMatch) {
      extracted.educationExpenses = this.parseAmount(educationMatch[1])
    }

    // Extrair dependentes
    const dependentsMatch = text.match(patterns.dependents)
    if (dependentsMatch) {
      extracted.dependents = parseInt(dependentsMatch[1])
    }

    // Estado civil
    if (patterns.married.test(text)) {
      extracted.civilStatus = 'married'
    } else if (patterns.single.test(text)) {
      extracted.civilStatus = 'single'
    }

    return extracted
  }

  private parseAmount(amountStr: string): number {
    // Remove espaços, substitui vírgula por ponto
    return parseFloat(amountStr.replace(/\s/g, '').replace(',', '.'))
  }

  private checkIfDataComplete(data: Partial<IRSData>): boolean {
    // Verifica se tem dados mínimos para calcular
    return !!(data.employmentIncome || data.businessIncome)
  }

  generateSmartSuggestions(currentData: Partial<IRSData>): string[] {
    const suggestions = []

    if (currentData.employmentIncome) {
      const income = currentData.employmentIncome
      
      // Sugestões baseadas no salário
      if (income > 50000) {
        suggestions.push("💡 Com o seu rendimento, considere o regime organizado")
        suggestions.push("💡 Despesas de saúde podem ser significativas - guarde todos os recibos")
      }
      
      if (currentData.dependents && currentData.dependents > 0) {
        suggestions.push("💡 Não se esqueça das despesas de educação dos seus filhos")
        suggestions.push("💡 Consultas médicas dos dependentes também são dedutíveis")
      }
    }

    return suggestions
  }
}

// Função para processar linguagem natural
export function parseNaturalLanguageAmount(text: string): number | null {
  // Remove espaços e converte para minúsculas
  const cleanText = text.toLowerCase().replace(/\s/g, '')
  
  // Padrões para diferentes formatos
  const patterns = [
    // "30 mil euros", "30mil", "30k"
    /(\d+)(?:[\.,](\d+))?(?:mil|k)/,
    // "2500 euros", "2.500€", "2,500"
    /(\d+)(?:[\.,](\d{3}))?(?:euros?|€)?/,
    // "dois mil e quinhentos"
    /dois\s*mil.*?(\d+)/
  ]

  for (const pattern of patterns) {
    const match = cleanText.match(pattern)
    if (match) {
      const thousands = parseInt(match[1])
      const units = match[2] ? parseInt(match[2]) : 0
      
      if (cleanText.includes('mil') || cleanText.includes('k')) {
        return thousands * 1000 + units
      } else {
        return thousands + (units / 1000)
      }
    }
  }

  return null
}