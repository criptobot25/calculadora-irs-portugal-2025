// lib/customIRS_AI.ts - IA Própria Especializada em IRS Português
import { IRS_KNOWLEDGE_BASE, IRS_UTILS } from './irsKnowledgeBase'

export interface IRSData {
  employmentIncome?: number
  businessIncome?: number
  investmentIncome?: number
  propertyIncome?: number
  healthExpenses?: number
  educationExpenses?: number
  housingExpenses?: number
  donationExpenses?: number
  civilStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  dependents?: number
  disabledDependents?: number
  isResident?: boolean
  withheldTax?: number
  region?: 'continental' | 'madeira' | 'azores'
}

export interface AIResponse {
  message: string
  extractedData?: Partial<IRSData>
  suggestions?: string[]
  nextQuestion?: string
  confidence: number
  isComplete: boolean
  errors?: string[]
}

export class CustomIRSAI {
  private conversationState: {
    collectedData: Partial<IRSData>
    currentStep: string
    conversationHistory: Array<{role: 'user' | 'ai', message: string, timestamp: Date}>
    questionsAsked: string[]
    userContext: {
      hasFamily: boolean
      isEmployed: boolean
      hasProperty: boolean
      hasBusiness: boolean
      needsHelp: string[]
    }
  }

  private readonly irsKnowledge = IRS_KNOWLEDGE_BASE

  constructor() {
    this.conversationState = {
      collectedData: {},
      currentStep: 'greeting',
      conversationHistory: [],
      questionsAsked: [],
      userContext: {
        hasFamily: false,
        isEmployed: false,
        hasProperty: false,
        hasBusiness: false,
        needsHelp: []
      }
    }
  }

  async processMessage(userMessage: string): Promise<AIResponse> {
    const normalizedMessage = this.normalizeMessage(userMessage)
    
    // Adicionar à conversa
    this.conversationState.conversationHistory.push({
      role: 'user',
      message: userMessage,
      timestamp: new Date()
    })

    // Extrair dados da mensagem
    const extractedData = this.extractDataFromMessage(normalizedMessage)
    
    // Atualizar dados coletados
    this.conversationState.collectedData = {
      ...this.conversationState.collectedData,
      ...extractedData
    }

    // Determinar próximo passo
    const response = this.generateResponse()
    
    // Adicionar resposta da IA à conversa
    this.conversationState.conversationHistory.push({
      role: 'ai',
      message: response.message,
      timestamp: new Date()
    })

    return response
  }

  private normalizeMessage(message: string): string {
    return message
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
  }

  private extractDataFromMessage(message: string): Partial<IRSData> {
    const extracted: Partial<IRSData> = {}

    // Usar padrões da base de conhecimento
    const patterns = this.irsKnowledge.naturalLanguage

    // Extrair rendimentos do trabalho
    for (const keyword of patterns.incomeKeywords) {
      const regex = new RegExp(`${keyword}.*?(\\d+(?:[.,]\\d+)?)\\s*(?:euros?|€)?`, 'gi')
      const matches = [...message.matchAll(regex)]
      if (matches.length > 0) {
        const amount = this.parseAmount(matches[0][1])
        if (amount > 0) {
          // Determinar se é mensal ou anual
          if (message.includes('mês') || message.includes('mensal')) {
            extracted.employmentIncome = amount * 12
          } else {
            extracted.employmentIncome = amount
          }
          this.conversationState.userContext.isEmployed = true
        }
      }
    }

    // Extrair despesas de saúde
    for (const keyword of patterns.expenseKeywords.health) {
      const regex = new RegExp(`${keyword}.*?(\\d+(?:[.,]\\d+)?)\\s*(?:euros?|€)?`, 'gi')
      const matches = [...message.matchAll(regex)]
      if (matches.length > 0) {
        const amount = this.parseAmount(matches[0][1])
        if (amount > 0) {
          extracted.healthExpenses = amount
        }
      }
    }

    // Extrair despesas de educação
    for (const keyword of patterns.expenseKeywords.education) {
      const regex = new RegExp(`${keyword}.*?(\\d+(?:[.,]\\d+)?)\\s*(?:euros?|€)?`, 'gi')
      const matches = [...message.matchAll(regex)]
      if (matches.length > 0) {
        const amount = this.parseAmount(matches[0][1])
        if (amount > 0) {
          extracted.educationExpenses = amount
        }
      }
    }

    // Extrair dependentes e estado civil
    for (const keyword of patterns.familyKeywords) {
      if (keyword.includes('filho') || keyword.includes('dependente')) {
        const regex = new RegExp(`(\\d+)\\s*${keyword}`, 'gi')
        const matches = [...message.matchAll(regex)]
        if (matches.length > 0) {
          const count = parseInt(matches[0][1]) || 0
          if (count > 0) {
            extracted.dependents = count
            this.conversationState.userContext.hasFamily = true
          }
        }
      } else if (message.includes('solteiro') || message.includes('solteira')) {
        extracted.civilStatus = 'single'
      } else if (message.includes('casado') || message.includes('casada')) {
        extracted.civilStatus = 'married'
        this.conversationState.userContext.hasFamily = true
      }
    }

    return extracted
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr) return 0
    return parseFloat(amountStr.replace(/\s/g, '').replace(',', '.')) || 0
  }

  private generateResponse(): AIResponse {
    const data = this.conversationState.collectedData
    
    // Determinar completude dos dados
    const completeness = this.calculateCompleteness(data)
    const suggestions = this.generateSuggestions(data)
    
    let responseMessage = ""
    let nextQuestion = ""
    let confidence = 0.8

    // Lógica de conversa baseada no estado atual
    if (this.conversationState.currentStep === 'greeting' || Object.keys(data).length === 0) {
      responseMessage = `Olá! Sou o assistente especialista em IRS português. Vou ajudá-lo a calcular o seu IRS de forma simples e precisa. 

Para começar, pode dizer-me qual o seu salário anual? Por exemplo: "Ganho 30.000 euros por ano" ou "Recebo 2.500€ por mês".`
      nextQuestion = "Qual é o seu rendimento anual do trabalho?"
      this.conversationState.currentStep = 'income'
      confidence = 1.0

    } else if (data.employmentIncome && !data.civilStatus) {
      const income = data.employmentIncome
      responseMessage = `Perfeito! Registei um rendimento de ${this.formatCurrency(income)} por ano. 

Agora preciso saber o seu estado civil para calcular as deduções corretas. É solteiro(a) ou casado(a)?`
      nextQuestion = "Qual é o seu estado civil?"
      this.conversationState.currentStep = 'civil_status'

    } else if (data.civilStatus && !data.dependents && data.dependents !== 0) {
      const status = data.civilStatus === 'married' ? 'casado(a)' : 'solteiro(a)'
      responseMessage = `Entendi que é ${status}. 

Tem filhos ou outros dependentes a cargo? Se sim, quantos?`
      nextQuestion = "Quantos dependentes tem?"
      this.conversationState.currentStep = 'dependents'

    } else if ((data.dependents !== undefined) && !data.healthExpenses) {
      const depText = data.dependents === 0 ? 'sem dependentes' : `com ${data.dependents} dependente${data.dependents > 1 ? 's' : ''}`
      responseMessage = `Registado: ${depText}. 

Agora vamos às despesas dedutíveis. Quanto gastou aproximadamente em saúde este ano? (consultas médicas, medicamentos, dentista, etc.)`
      nextQuestion = "Qual o valor das despesas de saúde?"
      this.conversationState.currentStep = 'health'

    } else if (data.healthExpenses !== undefined && !data.educationExpenses) {
      const healthText = data.healthExpenses === 0 ? 'sem despesas de saúde' : `${this.formatCurrency(data.healthExpenses)} em saúde`
      responseMessage = `Registado: ${healthText}. 

Tem despesas de educação? (propinas, material escolar, cursos, etc.)`
      nextQuestion = "Qual o valor das despesas de educação?"
      this.conversationState.currentStep = 'education'

    } else if (data.educationExpenses !== undefined && completeness > 0.7) {
      // Dados suficientes para calcular
      const estimate = this.calculateQuickEstimate(data)
      responseMessage = `Excelente! Com base nos dados fornecidos:

📊 **Resumo dos seus dados:**
• Rendimento: ${this.formatCurrency(data.employmentIncome || 0)}
• Estado civil: ${this.getStatusText(data.civilStatus)}
• Dependentes: ${data.dependents || 0}
• Saúde: ${this.formatCurrency(data.healthExpenses || 0)}
• Educação: ${this.formatCurrency(data.educationExpenses || 0)}

💡 **Estimativa rápida:**
${estimate.message}

Quer que calcule o valor exato ou tem mais informações para adicionar?`
      
      this.conversationState.currentStep = 'complete'
      confidence = 0.9

    } else {
      // Fallback
      responseMessage = "Pode fornecer mais detalhes? Por exemplo, valores de rendimentos ou despesas."
      confidence = 0.5
    }

    return {
      message: responseMessage,
      extractedData: data,
      suggestions,
      nextQuestion,
      confidence,
      isComplete: completeness > 0.8,
      errors: this.validateData(data)
    }
  }

  private calculateCompleteness(data: Partial<IRSData>): number {
    const requiredFields = ['employmentIncome', 'civilStatus', 'dependents']
    const optionalFields = ['healthExpenses', 'educationExpenses']
    
    let score = 0
    let total = 0

    // Campos obrigatórios (peso 2)
    for (const field of requiredFields) {
      total += 2
      if (data[field as keyof IRSData] !== undefined) {
        score += 2
      }
    }

    // Campos opcionais (peso 1)
    for (const field of optionalFields) {
      total += 1
      if (data[field as keyof IRSData] !== undefined) {
        score += 1
      }
    }

    return score / total
  }

  private generateSuggestions(data: Partial<IRSData>): string[] {
    // Usar sugestões da base de conhecimento
    return IRS_UTILS.generateSmartSuggestions(data)
  }

  private calculateQuickEstimate(data: Partial<IRSData>): {message: string, amount: number} {
    const income = data.employmentIncome || 0
    
    // Usar utilitários da base de conhecimento
    const grossTax = IRS_UTILS.calculateGrossTax(income)
    const deductions = IRS_UTILS.calculateDeductions(data)
    const finalTax = Math.max(0, grossTax - deductions)
    
    const bracket = IRS_UTILS.calculateTaxBracket(income)
    const marginalRate = bracket ? bracket.rate : 0
    
    return {
      message: `Taxa marginal: ${(marginalRate * 100).toFixed(1)}%
Imposto antes deduções: ${this.formatCurrency(grossTax)}
Deduções aplicadas: ${this.formatCurrency(deductions)}
**Imposto final estimado: ${this.formatCurrency(finalTax)}**`,
      amount: finalTax
    }
  }

  private validateData(data: Partial<IRSData>): string[] {
    const errors: string[] = []

    if (data.employmentIncome && data.employmentIncome < 0) {
      errors.push("Rendimento não pode ser negativo")
    }

    if (data.dependents && data.dependents < 0) {
      errors.push("Número de dependentes não pode ser negativo")
    }

    if (data.healthExpenses && data.healthExpenses < 0) {
      errors.push("Despesas de saúde não podem ser negativas")
    }

    return errors
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  private getStatusText(status?: string): string {
    switch (status) {
      case 'single': return 'Solteiro(a)'
      case 'married': return 'Casado(a)'
      case 'divorced': return 'Divorciado(a)'
      case 'widowed': return 'Viúvo(a)'
      default: return 'Não especificado'
    }
  }

  // Método para obter dados completos
  getCollectedData(): Partial<IRSData> {
    return { ...this.conversationState.collectedData }
  }

  // Método para reiniciar conversa
  reset(): void {
    this.conversationState = {
      collectedData: {},
      currentStep: 'greeting',
      conversationHistory: [],
      questionsAsked: [],
      userContext: {
        hasFamily: false,
        isEmployed: false,
        hasProperty: false,
        hasBusiness: false,
        needsHelp: []
      }
    }
  }

  // Método para exportar conversa
  exportConversation(): {
    data: Partial<IRSData>;
    history: Array<{ role: string; message: string; timestamp: Date }>;
    completeness: number;
  } {
    return {
      data: this.conversationState.collectedData,
      history: this.conversationState.conversationHistory,
      completeness: this.calculateCompleteness(this.conversationState.collectedData)
    }
  }
}