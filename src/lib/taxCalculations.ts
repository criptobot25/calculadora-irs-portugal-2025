import { TaxParameters, TaxBracket, CalculationInput, CalculationResult } from '@/types'

// Parâmetros fiscais de IRS para 2025 (valores aproximados para demonstração)
export const TAX_PARAMETERS_2025: TaxParameters = {
  year: 2025,
  brackets: [
    { min: 0, max: 7703, rate: 14.5 },
    { min: 7703, max: 11623, rate: 16.5 },
    { min: 11623, max: 15722, rate: 19.5 },
    { min: 15722, max: 20322, rate: 25 },
    { min: 20322, max: 25075, rate: 26.5 },
    { min: 25075, max: 36967, rate: 28.5 },
    { min: 36967, max: 80882, rate: 35 },
    { min: 80882, max: null, rate: 48 }
  ],
  socialSecurityRate: 11,
  pensionDeductions: {
    max: 2000,
    rate: 25
  },
  dependents: {
    spouse: 3000,
    children: [600, 750, 900, 900] // 1st, 2nd, 3rd, 4th+ children
  },
  standardDeductions: {
    health: 1000,
    education: 800,
    housing: 591
  },
  allowances: {
    personal: 4104,
    spouse: 4104,
    children: [600, 750, 900, 900]
  }
}

export function validateCalculationInput(input: Partial<CalculationInput>): string[] {
  const errors: string[] = []
  
  if (!input.grossSalary || input.grossSalary < 0) {
    errors.push('Salário bruto é obrigatório e deve ser positivo')
  }
  
  if (input.grossSalary && input.grossSalary > 1000000) {
    errors.push('Salário bruto parece demasiado elevado')
  }
  
  if (!input.maritalStatus) {
    errors.push('Estado civil é obrigatório')
  }
  
  if (input.dependents === undefined || input.dependents < 0) {
    errors.push('Número de dependentes é obrigatório')
  }
  
  if (input.independentIncome && input.independentIncome < 0) {
    errors.push('Rendimento independente deve ser positivo')
  }
  
  if (input.pension && input.pension < 0) {
    errors.push('Pensão deve ser positiva')
  }
  
  if (input.withholdingTax && input.withholdingTax < 0) {
    errors.push('Retenção na fonte deve ser positiva')
  }
  
  return errors
}

export function calculateIRS(input: CalculationInput, params: TaxParameters = TAX_PARAMETERS_2025): CalculationResult {
  // Calcular rendimento bruto total
  const grossIncome = input.grossSalary + 
    (input.independentIncome || 0) + 
    (input.pension || 0) +
    (input.subsidies?.meal || 0) +
    (input.subsidies?.vacation || 0) +
    (input.subsidies?.christmas || 0)
  
  // Calcular deduções pessoais
  const personalDeduction = params.allowances.personal
  const spouseDeduction = input.maritalStatus === 'married' ? params.allowances.spouse : 0
  
  // Calcular deduções por dependentes
  let dependentsDeduction = 0
  for (let i = 0; i < input.dependents; i++) {
    const childIndex = Math.min(i, params.allowances.children.length - 1)
    dependentsDeduction += params.allowances.children[childIndex]
  }
  
  // Calcular deduções específicas
  const healthDeduction = Math.min(input.deductions?.health || 0, params.standardDeductions.health)
  const educationDeduction = Math.min(input.deductions?.education || 0, params.standardDeductions.education)
  const housingDeduction = Math.min(input.deductions?.housing || 0, params.standardDeductions.housing)
  const donationsDeduction = input.deductions?.donations || 0
  const otherDeduction = input.deductions?.other || 0
  
  const totalDeductions = personalDeduction + spouseDeduction + dependentsDeduction + 
    healthDeduction + educationDeduction + housingDeduction + donationsDeduction + otherDeduction
  
  // Calcular rendimento tributável
  const taxableIncome = Math.max(0, grossIncome - totalDeductions)
  
  // Calcular imposto por escalões
  let taxDue = 0
  let remainingIncome = taxableIncome
  
  for (const bracket of params.brackets) {
    if (remainingIncome <= 0) break
    
    const bracketMin = bracket.min
    const bracketMax = bracket.max || Infinity
    const bracketSize = bracketMax - bracketMin
    const applicableIncome = Math.min(remainingIncome, bracketSize)
    
    if (taxableIncome > bracketMin) {
      taxDue += applicableIncome * (bracket.rate / 100)
      remainingIncome -= applicableIncome
    }
  }
  
  // Calcular taxa efetiva e marginal
  const effectiveRate = grossIncome > 0 ? (taxDue / grossIncome) * 100 : 0
  
  let marginalRate = 0
  for (const bracket of params.brackets) {
    if (taxableIncome > bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
      marginalRate = bracket.rate
      break
    }
  }
  
  // Calcular reembolso ou pagamento
  const withheld = input.withholdingTax || 0
  const refundOrPayment = withheld - taxDue
  
  return {
    grossIncome,
    taxableIncome,
    taxDue,
    withheld,
    refundOrPayment,
    effectiveRate,
    marginalRate,
    breakdown: {
      deductions: {
        personal: personalDeduction,
        spouse: spouseDeduction,
        dependents: dependentsDeduction,
        health: healthDeduction,
        education: educationDeduction,
        housing: housingDeduction,
        donations: donationsDeduction,
        other: otherDeduction,
        total: totalDeductions
      },
      tax: {
        beforeCredits: taxDue,
        credits: 0, // Simplified - no tax credits implemented
        final: taxDue
      }
    }
  }
}

export function calculateTaxBracketBreakdown(taxableIncome: number, brackets: TaxBracket[]) {
  const breakdown: Array<{
    bracket: TaxBracket
    income: number
    tax: number
  }> = []
  
  let remainingIncome = taxableIncome
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break
    
    const bracketMin = bracket.min
    const bracketMax = bracket.max || Infinity
    const bracketSize = bracketMax - bracketMin
    const applicableIncome = Math.min(remainingIncome, bracketSize)
    
    if (taxableIncome > bracketMin) {
      const tax = applicableIncome * (bracket.rate / 100)
      breakdown.push({
        bracket,
        income: applicableIncome,
        tax
      })
      remainingIncome -= applicableIncome
    }
  }
  
  return breakdown
}

export function getEstimatedRefundDate(): Date {
  const currentYear = new Date().getFullYear()
  // Assuming refunds typically come between June and August
  return new Date(currentYear, 6, 15) // July 15th
}

export function getNextTaxDeadline(): Date {
  const currentYear = new Date().getFullYear()
  const currentDate = new Date()
  
  // Tax deadline is typically March 31st
  const deadline = new Date(currentYear, 2, 31) // March 31st
  
  // If deadline has passed this year, return next year's deadline
  if (currentDate > deadline) {
    return new Date(currentYear + 1, 2, 31)
  }
  
  return deadline
}