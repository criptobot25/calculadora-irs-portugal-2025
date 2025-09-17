// lib/huggingfaceAI.ts - Nova IA gratuita com Hugging Face
import { IRSData } from './customIRS_AI'

interface HFMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface HFResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class HuggingFaceIRS {
  private apiKey: string
  private baseURL = 'https://router.huggingface.co/v1/chat/completions'
  private model = 'deepseek-ai/DeepSeek-V3-0324' // Modelo gratuito e muito bom

  constructor() {
    // API key será configurada via variável de ambiente
    this.apiKey = process.env.NEXT_PUBLIC_HF_TOKEN || ''
  }

  async processMessage(userMessage: string, conversationHistory: HFMessage[] = []): Promise<{
    message: string
    extractedData: Partial<IRSData>
    confidence: number
  }> {
    try {
      // Construir contexto especializado em IRS português
      const systemPrompt = `Você é um assistente especialista em IRS (Imposto sobre o Rendimento de Pessoas Singulares) português. 

MISSÃO: Extrair dados fiscais de conversas naturais em português e guiar usuários no cálculo de IRS.

DADOS PARA EXTRAIR:
- Rendimento (salário, freelancer, pensão)
- Estado civil (solteiro, casado, divorciado)
- Dependentes (número de filhos)
- Despesas dedutíveis (saúde, educação, habitação)

REGRAS IRS 2025:
- Escalões: 14.5% a 48%
- Dedução pessoal: 4.104€
- Dedução cônjuge: 4.104€
- Dependentes: 600€ (1º), 750€ (2º), 900€ (3º+)
- Limites: Saúde 1.000€, Educação 800€, Habitação 591€

FORMATO DE RESPOSTA:
1. Resposta amigável em português
2. Perguntas para dados em falta
3. No final: "DADOS_EXTRAIDOS: {json dos dados extraídos}"

EXEMPLOS:
- "Sou motorista" → perguntar salário
- "Ganho 30000 euros" → confirmar e perguntar estado civil
- "Sou casado com 2 filhos" → extrair estado civil e dependentes`

      const messages: HFMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ]

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.3,
          max_tokens: 800,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: HFResponse = await response.json()
      const aiResponse = data.choices[0].message.content

      // Extrair dados do final da resposta
      const extractedData = this.extractDataFromResponse(aiResponse)
      
      // Limpar resposta removendo a parte técnica
      const cleanMessage = aiResponse.replace(/DADOS_EXTRAIDOS:.*$/g, '').trim()

      return {
        message: cleanMessage,
        extractedData,
        confidence: this.calculateConfidence(extractedData)
      }

    } catch (error) {
      console.error('Erro na API Hugging Face:', error)
      
      // Fallback para IA local em caso de erro
      return {
        message: 'Desculpe, houve um problema temporário. Por favor, pode repetir a informação?',
        extractedData: {},
        confidence: 0
      }
    }
  }

  private extractDataFromResponse(response: string): Partial<IRSData> {
    const extracted: Partial<IRSData> = {}

    try {
      // Procurar por DADOS_EXTRAIDOS no final da resposta
      const dataMatch = response.match(/DADOS_EXTRAIDOS:\s*({.*})/)
      if (dataMatch) {
        const jsonData = JSON.parse(dataMatch[1])
        return this.normalizeExtractedData(jsonData)
      }
    } catch (error) {
      console.log('Erro ao extrair JSON, usando extração manual:', error)
    }

    // Extração manual como fallback
    return this.manualExtraction(response)
  }

  private normalizeExtractedData(data: Record<string, unknown>): Partial<IRSData> {
    const normalized: Partial<IRSData> = {}

    // Normalizar campos
    if (data.rendimento || data.salario || data.income) {
      normalized.employmentIncome = Number(data.rendimento || data.salario || data.income)
    }
    
    if (data.rendimento_independente || data.faturacao) {
      normalized.independentIncome = Number(data.rendimento_independente || data.faturacao)
    }

    if (data.estado_civil || data.civil_status) {
      const status = String(data.estado_civil || data.civil_status).toLowerCase()
      if (status.includes('solteiro') || status === 'single') normalized.civilStatus = 'single'
      if (status.includes('casado') || status === 'married') normalized.civilStatus = 'married'
      if (status.includes('divorciado') || status === 'divorced') normalized.civilStatus = 'divorced'
    }

    if (data.dependentes || data.filhos || data.dependents) {
      normalized.dependents = Number(data.dependentes || data.filhos || data.dependents)
    }

    if (data.saude || data.health) {
      normalized.healthExpenses = Number(data.saude || data.health)
    }

    if (data.educacao || data.education) {
      normalized.educationExpenses = Number(data.educacao || data.education)
    }

    return normalized
  }

  private manualExtraction(text: string): Partial<IRSData> {
    const extracted: Partial<IRSData> = {}

    // Extrair rendimentos
    const incomePatterns = [
      /(?:salário|ganho|recebo|vencimento).*?(\d+(?:\.\d{3})*(?:,\d+)?)\s*(?:euros?|€)/gi,
      /(\d+(?:\.\d{3})*(?:,\d+)?)\s*(?:euros?|€).*?(?:salário|ganho|recebo|anual)/gi
    ]

    for (const pattern of incomePatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        const amount = this.parsePortugueseNumber(matches[0][1])
        if (amount > 0) {
          extracted.employmentIncome = amount
          break
        }
      }
    }

    // Extrair estado civil
    if (/(solteiro|solteira)/gi.test(text)) extracted.civilStatus = 'single'
    if (/(casado|casada)/gi.test(text)) extracted.civilStatus = 'married'
    if (/(divorciado|divorciada)/gi.test(text)) extracted.civilStatus = 'divorced'

    // Extrair dependentes
    const dependentsMatch = text.match(/(\d+)\s*(?:filhos?|dependentes?|crianças?)/gi)
    if (dependentsMatch) {
      extracted.dependents = parseInt(dependentsMatch[0])
    }

    return extracted
  }

  private parsePortugueseNumber(numStr: string): number {
    // Converter formato português (1.500,50) para number
    let cleaned = numStr.replace(/\s/g, '')
    
    // Se tem vírgula, é decimal português
    if (cleaned.includes(',')) {
      const parts = cleaned.split(',')
      if (parts.length === 2) {
        const integerPart = parts[0].replace(/\./g, '') // Remove pontos dos milhares
        const decimalPart = parts[1]
        cleaned = integerPart + '.' + decimalPart
      }
    } else {
      // Remove pontos que são separadores de milhares
      cleaned = cleaned.replace(/\./g, '')
    }
    
    return parseFloat(cleaned) || 0
  }

  private calculateConfidence(data: Partial<IRSData>): number {
    let score = 0
    let total = 0

    // Rendimento (peso 3)
    total += 3
    if (data.employmentIncome || data.independentIncome) score += 3

    // Estado civil (peso 2)
    total += 2
    if (data.civilStatus) score += 2

    // Dependentes (peso 1)
    total += 1
    if (data.dependents !== undefined) score += 1

    return total > 0 ? (score / total) : 0
  }

  // Método para configurar API key dinamicamente
  setApiKey(key: string) {
    this.apiKey = key
  }

  // Método para testar se API está funcionando
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.processMessage('teste')
      return response.message.length > 0
    } catch {
      return false
    }
  }
}