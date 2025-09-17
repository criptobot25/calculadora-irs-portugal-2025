// lib/customIRS_AI.ts - IA Própria Especializada em IRS Português
import { IRS_KNOWLEDGE_BASE, IRS_UTILS } from './irsKnowledgeBase'

export interface IRSData {
  employmentIncome?: number
  independentIncome?: number
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
      isIndependent: boolean
      isRetired: boolean
      hasProperty: boolean
      hasBusiness: boolean
      workType: 'employed' | 'independent' | 'retired' | 'unemployed' | null
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
        isIndependent: false,
        isRetired: false,
        hasProperty: false,
        hasBusiness: false,
        workType: null,
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

    // 0. DETECTAR SITUAÇÃO PROFISSIONAL - EXPANDIDO
    const professionalSituationPatterns = [
      // Trabalho independente
      { patterns: [/sou\s+freelancer/gi, /trabalho\s+como\s+freelancer/gi, /freelancer/gi], type: 'independent' },
      { patterns: [/sou\s+trabalhador\s+independente/gi, /trabalho\s+independente/gi, /independente/gi], type: 'independent' },
      { patterns: [/sou\s+autônomo/gi, /trabalho\s+autônomo/gi, /autônomo/gi], type: 'independent' },
      { patterns: [/sou\s+empresário/gi, /tenho\s+empresa/gi, /sou\s+patrão/gi], type: 'independent' },
      { patterns: [/recibo\s+verde/gi, /emito\s+recibos/gi], type: 'independent' },
      
      // Trabalho por conta de outrem - profissões específicas
      { patterns: [/sou\s+motorista/gi, /trabalho\s+como\s+motorista/gi, /conduzo/gi, /condutor/gi], type: 'employed' },
      { patterns: [/sou\s+vendedor/gi, /trabalho\s+em\s+vendas/gi, /comercial/gi], type: 'employed' },
      { patterns: [/sou\s+professor/gi, /sou\s+docente/gi, /ensino/gi, /leciono/gi], type: 'employed' },
      { patterns: [/sou\s+enfermeiro/gi, /trabalho\s+no\s+hospital/gi, /área\s+da\s+saúde/gi], type: 'employed' },
      { patterns: [/sou\s+engenheiro/gi, /sou\s+arquiteto/gi, /sou\s+advogado/gi], type: 'employed' },
      { patterns: [/sou\s+técnico/gi, /sou\s+mecânico/gi, /sou\s+eletricista/gi], type: 'employed' },
      { patterns: [/trabalho\s+numa?\s+empresa/gi, /trabalho\s+em/gi, /empregado\s+em/gi], type: 'employed' },
      { patterns: [/sou\s+funcionário/gi, /trabalho\s+por\s+conta\s+de\s+outrem/gi, /empregado/gi], type: 'employed' },
      
      // Reforma/pensão
      { patterns: [/sou\s+reformado/gi, /sou\s+pensionista/gi, /reforma/gi, /pensão/gi], type: 'retired' }
    ]

    for (const situation of professionalSituationPatterns) {
      for (const pattern of situation.patterns) {
        if (pattern.test(message)) {
          this.conversationState.userContext.workType = situation.type as 'employed' | 'independent' | 'retired'
          
          // Se é independente/freelancer, perguntar rendimento independente
          if (situation.type === 'independent') {
            this.conversationState.userContext.isIndependent = true
            // Marcar que precisa de rendimento independente em vez de salário
            this.conversationState.currentStep = 'independent_income'
          } else if (situation.type === 'employed') {
            this.conversationState.userContext.isEmployed = true
            this.conversationState.currentStep = 'employment_income'
          } else if (situation.type === 'retired') {
            this.conversationState.userContext.isRetired = true
            this.conversationState.currentStep = 'pension_income'
          }
          break
        }
      }
    }

    // 1. EXTRAIR RENDIMENTOS DO TRABALHO - Melhorado
    const incomePatterns = [
      // Padrões básicos melhorados
      /(?:salário|vencimento|ordenado|ganho|recebo|auferido|rendimento|remuneração)\s+(?:de\s+|é\s+|:?\s*)?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€).*?(?:salário|vencimento|ordenado|por mês|mensal|anual)/gi,
      
      // Padrões com "k" para milhares
      /(?:salário|vencimento|ordenado|ganho|recebo)\s+(?:de\s+|é\s+|:?\s*)?(\d+(?:[.,]\d+)?)k/gi,
      
      // Padrões mais diretos
      /(?:ganho|recebo|aufiro)\s+(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(?:o\s+meu\s+|meu\s+)?(?:salário|vencimento|ordenado)\s+(?:é\s+)?(?:de\s+)?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi
    ]

    for (const pattern of incomePatterns) {
      const matches = [...message.matchAll(pattern)]
      if (matches.length > 0) {
        let amount = this.parseAmount(matches[0][1])
        
        // Detectar multiplicadores na frase original
        const originalMatch = matches[0][0]
        
        if (originalMatch.includes('mil') || message.includes('mil')) {
          amount = amount * 1000
        }
        
        if (originalMatch.includes('k') || message.includes('k')) {
          amount = amount * 1000
        }
        
        if (amount > 0) {
          // Determinar se é mensal ou anual
          if (message.includes('mês') || message.includes('mensal') || message.includes('mensais')) {
            extracted.employmentIncome = amount * 12
          } else {
            extracted.employmentIncome = amount
          }
          this.conversationState.userContext.isEmployed = true
          break
        }
      }
    }

    // 1.5. EXTRAIR RENDIMENTOS INDEPENDENTES - NOVO
    const independentIncomePatterns = [
      /(?:faturo|faturei|facturo|facturei)\s+(?:cerca\s+de\s+)?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(?:como\s+freelancer|independente|autônomo).*?(?:ganho|recebo|faturo)\s+(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€).*?(?:independente|freelancer|autônomo|faturação)/gi,
      /(?:rendimento|receita)\s+(?:independente|freelancer).*?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(?:trabalho\s+independente|freelancer).*?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi
    ]

    // Se detectou que é independente ou se mencionou termos de trabalho independente
    if (this.conversationState.userContext.isIndependent || 
        /freelancer|independente|autônomo|faturo|recibo\s+verde/gi.test(message)) {
      
      for (const pattern of independentIncomePatterns) {
        const matches = [...message.matchAll(pattern)]
        if (matches.length > 0) {
          let amount = this.parseAmount(matches[0][1])
          
          // Detectar multiplicadores
          const originalMatch = matches[0][0]
          
          if (originalMatch.includes('mil') || message.includes('mil')) {
            amount = amount * 1000
          }
          
          if (originalMatch.includes('k') || message.includes('k')) {
            amount = amount * 1000
          }
          
          if (amount > 0) {
            // Determinar se é mensal ou anual
            if (message.includes('mês') || message.includes('mensal') || message.includes('mensais')) {
              extracted.independentIncome = amount * 12
            } else {
              extracted.independentIncome = amount
            }
            this.conversationState.userContext.isIndependent = true
            break
          }
        }
      }
    }

    // 2. EXTRAIR DESPESAS DE SAÚDE - Melhorado
    const healthPatterns = [
      /(?:médico|medicina|hospital|clínica|farmácia|dentista|consulta|saúde).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:euros?|€).*?(?:médico|medicina|hospital|clínica|farmácia|dentista|consulta|saúde)/gi,
      /(?:gastei|paguei|tive gastos?).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€).*?(?:médico|medicina|hospital|saúde)/gi,
      /(?:despesas?|gastos?).*?(?:de\s+)?(?:saúde|médicos?).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(?:medicamentos?|farmácia).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi
    ]

    for (const pattern of healthPatterns) {
      const matches = [...message.matchAll(pattern)]
      if (matches.length > 0) {
        const amount = this.parseAmount(matches[0][1])
        if (amount > 0) {
          extracted.healthExpenses = amount
          break
        }
      }
    }

    // 3. EXTRAIR DESPESAS DE EDUCAÇÃO - Melhorado
    const educationPatterns = [
      /(?:educação|escola|universidade|colégio|propina|livros|creche).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:euros?|€).*?(?:educação|escola|universidade|propina|livros|creche)/gi,
      /(?:paguei|gastei).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€).*?(?:propinas?|educação|escola)/gi,
      /(?:despesas?|gastos?).*?(?:de\s+)?(?:educação|escola).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(?:mensalidade|propina).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi
    ]

    for (const pattern of educationPatterns) {
      const matches = [...message.matchAll(pattern)]
      if (matches.length > 0) {
        let amount = this.parseAmount(matches[0][1])
        if (amount > 0) {
          // Se menciona mensalidade, multiplicar por 12
          if (message.includes('mensalidade') || message.includes('mensal')) {
            amount = amount * 12
          }
          extracted.educationExpenses = amount
          break
        }
      }
    }

    // 4. EXTRAIR DESPESAS DE HABITAÇÃO - Melhorado
    const housingPatterns = [
      /(?:prestação|juros|empréstimo|casa|habitação).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:euros?|€).*?(?:prestação|juros|empréstimo|casa|habitação)/gi,
      /(?:pago|paguei).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€).*?(?:prestação|casa|empréstimo)/gi,
      /(?:despesas?|gastos?).*?(?:de\s+)?(?:habitação|casa).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(?:renda|aluguer|arrendamento).*?(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi
    ]

    for (const pattern of housingPatterns) {
      const matches = [...message.matchAll(pattern)]
      if (matches.length > 0) {
        let amount = this.parseAmount(matches[0][1])
        if (amount > 0) {
          // Se menciona prestação ou renda mensal, multiplicar por 12
          if ((message.includes('prestação') || message.includes('renda') || message.includes('aluguer')) && 
              (message.includes('mês') || message.includes('mensal'))) {
            amount = amount * 12
          }
          extracted.housingExpenses = amount
          break
        }
      }
    }

    // 5. EXTRAIR DEPENDENTES - Muito Melhorado
    const dependentsPatterns = [
      // Padrões diretos com números
      /tenho\s*(\d+)\s*(?:filhos?|dependentes?|crianças?)/gi,
      /(?:sou pai|sou mãe).*?(\d+)\s*filhos?/gi,
      /(\d+)\s*(?:filhos?|dependentes?|crianças?)/gi,
      
      // Padrões com números por extenso
      /tenho\s*(um|uma|dois|duas|três|quatro|cinco|seis)\s*(?:filhos?|dependentes?|crianças?|filhas?)/gi,
      /(?:sou pai|sou mãe).*?(um|uma|dois|duas|três|quatro|cinco)\s*(?:filhos?|filhas?)/gi,
      /(?:sou pai|sou mãe).*?(duas?|três|quatro|cinco)\s*(?:filhos?|crianças?|filhas?)/gi,
      
      // Padrões específicos para "uma filha" e outros casos
      /tenho\s*uma\s*filha/gi,
      /(?:sou pai|sou mãe)\s*de\s*uma\s*filha/gi,
      /e\s*(três|dois|duas)\s*(?:filhos?|crianças?)/gi,
      /temos\s*(três|dois|duas|um|uma)\s*(?:filhos?|crianças?)/gi,
      
      // Padrões de negação
      /(?:não tenho|sem)\s*(?:filhos?|dependentes?|crianças?)/gi,
      /(?:zero|nenhum|nenhuma)\s*(?:filhos?|dependentes?|crianças?)/gi
    ]

    for (const pattern of dependentsPatterns) {
      const matches = [...message.matchAll(pattern)]
      if (matches.length > 0) {
        const match = matches[0][0]
        
        // Se é negação, retornar 0
        if (/não|sem|zero|nenhum|nenhuma/.test(match)) {
          extracted.dependents = 0
          break
        }
        
        // Se menciona "uma filha" especificamente
        if (/uma\s*filha/i.test(match)) {
          extracted.dependents = 1
          this.conversationState.userContext.hasFamily = true
          break
        }
        
        const numberStr = matches[0][1]
        let count = 0
        
        // Converter números por extenso
        const numberMap: Record<string, number> = {
          'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 
          'quatro': 4, 'cinco': 5, 'seis': 6
        }
        
        if (numberStr && numberMap[numberStr]) {
          count = numberMap[numberStr]
        } else if (numberStr && !isNaN(parseInt(numberStr))) {
          count = parseInt(numberStr)
        }
        
        if (count > 0) {
          extracted.dependents = count
          this.conversationState.userContext.hasFamily = true
          break
        }
      }
    }

    // 6. EXTRAIR ESTADO CIVIL - Muito Melhorado
    const civilStatusPatterns = [
      { pattern: /(?:sou|estou)\s*(?:solteiro|solteira)/gi, status: 'single' },
      { pattern: /(?:sou|estou)\s*(?:casado|casada)/gi, status: 'married' },
      { pattern: /(?:sou|estou)\s*(?:divorciado|divorciada)/gi, status: 'divorced' },
      { pattern: /(?:tenho|minha?)\s*(?:esposa|marido|cônjuge)/gi, status: 'married' },
      { pattern: /(?:união de facto|vivo junto|companheiro|companheira)/gi, status: 'married' },
      { pattern: /(?:não tenho|sem)\s*(?:esposa|marido|cônjuge)/gi, status: 'single' },
      { pattern: /(?:pessoa|vida)\s*solteira/gi, status: 'single' }
    ]

    for (const item of civilStatusPatterns) {
      if (item.pattern.test(message)) {
        extracted.civilStatus = item.status as 'single' | 'married' | 'divorced'
        if (item.status === 'married') {
          this.conversationState.userContext.hasFamily = true
        }
        break
      }
    }

    return extracted
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr) return 0
    
    // Remover espaços e manter apenas números, vírgulas e pontos
    let cleaned = amountStr.replace(/[^\d,.]/g, '').trim()
    const hasK = /\d+k/i.test(amountStr)
    
    // Tratar diferentes formatos monetários
    if (cleaned.includes(',') && cleaned.includes('.')) {
      // Formato: 1.234,56 (português) ou 1,234.56 (inglês)
      if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
        // Vírgula é decimal: 1.234,56 -> 1234.56
        cleaned = cleaned.replace(/\./g, '').replace(',', '.')
      } else {
        // Ponto é decimal: 1,234.56 -> 1234.56
        cleaned = cleaned.replace(/,/g, '')
      }
    } else if (cleaned.includes(',')) {
      // Apenas vírgula
      const parts = cleaned.split(',')
      if (parts.length === 2 && parts[1].length <= 2) {
        // Vírgula como decimal: 1500,50 -> 1500.50
        cleaned = cleaned.replace(',', '.')
      } else {
        // Vírgula como milhares: 1,500 -> 1500
        cleaned = cleaned.replace(/,/g, '')
      }
    } else if (cleaned.includes('.')) {
      // Apenas ponto - determinar se é decimal ou milhares
      const parts = cleaned.split('.')
      if (parts.length === 2 && parts[1].length <= 2 && parts[0].length <= 3) {
        // Ponto como decimal: 123.45 -> 123.45
        // Não fazer nada, já está correto
      } else {
        // Ponto como milhares: 1.500 ou 45.000 -> 1500 ou 45000
        cleaned = cleaned.replace(/\./g, '')
      }
    }
    
    const amount = parseFloat(cleaned) || 0
    
    // Se tem "k", multiplicar por 1000
    return hasK ? amount * 1000 : amount
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

    } else if (this.conversationState.currentStep === 'employment_income' || 
               (this.conversationState.userContext.isEmployed && !data.employmentIncome && !data.independentIncome)) {
      responseMessage = `Entendi que trabalha por conta de outrem! 

Para calcular o seu IRS corretamente, preciso saber o seu salário anual. Pode dizer-me quanto ganha? Por exemplo: "Ganho 30.000 euros por ano" ou "Recebo 2.500€ por mês".`
      nextQuestion = "Qual é o seu salário anual?"
      this.conversationState.currentStep = 'employment_income'
      confidence = 1.0

    } else if (this.conversationState.currentStep === 'independent_income' || 
               (this.conversationState.userContext.isIndependent && !data.employmentIncome && !data.independentIncome)) {
      responseMessage = `Entendi que é freelancer/trabalhador independente! 

Para calcular o seu IRS corretamente, preciso saber o seu rendimento anual. Pode dizer-me quanto faturou no ano? Por exemplo: "Faturei 25.000 euros" ou "Ganho cerca de 2.000€ por mês".`
      nextQuestion = "Qual é o seu rendimento anual como independente?"
      this.conversationState.currentStep = 'independent_income'
      confidence = 1.0

    } else if ((data.employmentIncome || data.independentIncome) && !data.civilStatus) {
      const income = data.employmentIncome || data.independentIncome || 0
      const incomeType = data.employmentIncome ? 'salário' : 'rendimento independente'
      responseMessage = `Perfeito! Registei um ${incomeType} de ${this.formatCurrency(income)} por ano. 

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
• Rendimento: ${this.formatCurrency((data.employmentIncome || data.independentIncome) || 0)} ${data.independentIncome ? '(Independente)' : '(Trabalho)'}
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
    // Aceitar tanto rendimento do trabalho quanto independente
    const hasIncome = data.employmentIncome || data.independentIncome
    const requiredFields = ['civilStatus', 'dependents']
    const optionalFields = ['healthExpenses', 'educationExpenses']
    
    let score = 0
    let total = 0

    // Campo de rendimento obrigatório (peso 2)
    total += 2
    if (hasIncome) {
      score += 2
    }

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
        isIndependent: false,
        isRetired: false,
        hasProperty: false,
        hasBusiness: false,
        workType: null,
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