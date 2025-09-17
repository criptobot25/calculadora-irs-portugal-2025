// lib/irsAIValidators.ts - Validadores Inteligentes para IA do IRS
import { IRSData } from './customIRS_AI'
import { IRS_KNOWLEDGE_BASE } from './irsKnowledgeBase'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export class IRSAIValidators {
  
  // Validação completa dos dados
  static validateFullData(data: Partial<IRSData>): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    }

    // Validar rendimentos
    const incomeValidation = this.validateIncome(data)
    result.errors.push(...incomeValidation.errors)
    result.warnings.push(...incomeValidation.warnings)

    // Validar despesas
    const expensesValidation = this.validateExpenses(data)
    result.errors.push(...expensesValidation.errors)
    result.warnings.push(...expensesValidation.warnings)

    // Validar dependentes
    const dependentsValidation = this.validateDependents(data)
    result.errors.push(...dependentsValidation.errors)
    result.warnings.push(...dependentsValidation.warnings)

    // Validar coerência geral
    const coherenceValidation = this.validateCoherence(data)
    result.errors.push(...coherenceValidation.errors)
    result.warnings.push(...coherenceValidation.warnings)

    // Gerar sugestões
    result.suggestions = this.generateValidationSuggestions(data)

    result.isValid = result.errors.length === 0

    return result
  }

  // Validar rendimentos
  private static validateIncome(data: Partial<IRSData>): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [], suggestions: [] }

    if (data.employmentIncome !== undefined) {
      if (data.employmentIncome < 0) {
        result.errors.push("Rendimento do trabalho não pode ser negativo")
      }
      if (data.employmentIncome > 500000) {
        result.warnings.push("Rendimento muito elevado - verifique se está correto")
      }
      if (data.employmentIncome < 8000) {
        result.suggestions.push("💡 Com rendimentos baixos, verifique benefícios fiscais disponíveis")
      }
    }

    if (data.businessIncome !== undefined) {
      if (data.businessIncome < 0) {
        result.errors.push("Rendimento empresarial não pode ser negativo")
      }
      if (data.businessIncome > 0 && data.employmentIncome && data.employmentIncome > 0) {
        result.warnings.push("Tem rendimentos Categoria A e B - verifique regime fiscal mais vantajoso")
      }
    }

    return result
  }

  // Validar despesas
  private static validateExpenses(data: Partial<IRSData>): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [], suggestions: [] }

    const totalIncome = (data.employmentIncome || 0) + (data.businessIncome || 0) + 
                       (data.investmentIncome || 0) + (data.propertyIncome || 0)

    if (data.healthExpenses !== undefined) {
      if (data.healthExpenses < 0) {
        result.errors.push("Despesas de saúde não podem ser negativas")
      }
      if (totalIncome > 0 && data.healthExpenses > totalIncome * 0.3) {
        result.warnings.push("Despesas de saúde muito elevadas relativamente ao rendimento")
      }
    }

    if (data.educationExpenses !== undefined) {
      if (data.educationExpenses < 0) {
        result.errors.push("Despesas de educação não podem ser negativas")
      }
      if (data.educationExpenses > IRS_KNOWLEDGE_BASE.deductions.expenses.education.max_deduction / 0.30) {
        result.warnings.push(`Despesas de educação acima do limite dedutível (máximo ${IRS_KNOWLEDGE_BASE.deductions.expenses.education.max_deduction}€ de dedução)`)
      }
    }

    if (data.housingExpenses !== undefined) {
      if (data.housingExpenses < 0) {
        result.errors.push("Despesas de habitação não podem ser negativas")
      }
    }

    return result
  }

  // Validar dependentes
  private static validateDependents(data: Partial<IRSData>): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [], suggestions: [] }

    if (data.dependents !== undefined) {
      if (data.dependents < 0) {
        result.errors.push("Número de dependentes não pode ser negativo")
      }
      if (data.dependents > 10) {
        result.warnings.push("Número de dependentes muito elevado - verifique se está correto")
      }
      if (data.dependents > 0 && data.civilStatus === 'single') {
        result.suggestions.push("💡 Como solteiro(a) com dependentes, pode ter benefícios fiscais especiais")
      }
    }

    if (data.disabledDependents !== undefined) {
      if (data.disabledDependents < 0) {
        result.errors.push("Número de dependentes com deficiência não pode ser negativo")
      }
      if (data.dependents !== undefined && data.disabledDependents > data.dependents) {
        result.errors.push("Dependentes com deficiência não pode exceder total de dependentes")
      }
    }

    return result
  }

  // Validar coerência dos dados
  private static validateCoherence(data: Partial<IRSData>): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [], suggestions: [] }

    // Verificar se tem rendimentos mínimos
    const hasAnyIncome = (data.employmentIncome || 0) + (data.businessIncome || 0) + 
                        (data.investmentIncome || 0) + (data.propertyIncome || 0) > 0

    if (!hasAnyIncome) {
      result.warnings.push("Não foram declarados rendimentos - verifique se é correto")
    }

    // Verificar coerência entre estado civil e dependentes
    if (data.civilStatus === 'single' && data.dependents && data.dependents > 4) {
      result.warnings.push("Solteiro(a) com muitos dependentes - situação pouco comum")
    }

    // Verificar se despesas fazem sentido
    if (data.educationExpenses && data.educationExpenses > 0 && 
        (!data.dependents || data.dependents === 0)) {
      result.suggestions.push("💡 Tem despesas de educação mas não declarou dependentes - podem ser suas próprias despesas")
    }

    return result
  }

  // Gerar sugestões baseadas na validação
  private static generateValidationSuggestions(data: Partial<IRSData>): string[] {
    const suggestions: string[] = []

    // Sugestões baseadas no perfil
    if (data.employmentIncome && data.employmentIncome > 30000) {
      suggestions.push("💡 Considere contribuições para PPR para reduzir imposto")
    }

    if (data.dependents && data.dependents > 0 && (!data.educationExpenses || data.educationExpenses === 0)) {
      suggestions.push("💡 Verifique se tem despesas de educação dos filhos para deduzir")
    }

    if (data.civilStatus === 'married') {
      suggestions.push("💡 Compare tributação conjunta vs separada para otimizar")
    }

    if (!data.healthExpenses || data.healthExpenses === 0) {
      suggestions.push("💡 Guarde recibos de farmácia, consultas e óculos para deduções")
    }

    return suggestions
  }

  // Validar formato de valores monetários
  static validateCurrency(value: string): { isValid: boolean, amount?: number, error?: string } {
    // Remover espaços e normalizar
    const cleaned = value.replace(/\s/g, '').replace(',', '.')
    
    // Verificar padrões válidos
    const patterns = [
      /^\d+(\.\d{1,2})?$/,  // 1000 ou 1000.50
      /^\d{1,3}(\.\d{3})*(\.\d{2})?$/,  // 1.000.000.50
    ]

    for (const pattern of patterns) {
      if (pattern.test(cleaned)) {
        const amount = parseFloat(cleaned.replace(/\./g, '').replace(/,/, '.'))
        if (!isNaN(amount) && amount >= 0) {
          return { isValid: true, amount }
        }
      }
    }

    return { isValid: false, error: "Formato de valor inválido" }
  }

  // Detectar e corrigir inconsistências automáticamente
  static autoCorrectData(data: Partial<IRSData>): { corrected: Partial<IRSData>, changes: string[] } {
    const corrected = { ...data }
    const changes: string[] = []

    // Corrigir valores negativos
    if (corrected.employmentIncome && corrected.employmentIncome < 0) {
      corrected.employmentIncome = Math.abs(corrected.employmentIncome)
      changes.push("Corrigido rendimento negativo para positivo")
    }

    // Corrigir dependentes impossíveis
    if (corrected.disabledDependents && corrected.dependents && 
        corrected.disabledDependents > corrected.dependents) {
      corrected.disabledDependents = corrected.dependents
      changes.push("Corrigido número de dependentes com deficiência")
    }

    // Aplicar limites máximos às deduções
    if (corrected.educationExpenses && corrected.educationExpenses * 0.30 > 800) {
      const maxExpenses = 800 / 0.30
      changes.push(`Despesas de educação limitadas a ${maxExpenses.toFixed(2)}€ (limite de dedução)`)
    }

    return { corrected, changes }
  }
}