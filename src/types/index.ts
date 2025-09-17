export interface TaxParameters {
  year: number
  brackets: TaxBracket[]
  socialSecurityRate: number
  pensionDeductions: {
    max: number
    rate: number
  }
  dependents: {
    spouse: number
    children: number[]
  }
  standardDeductions: {
    health: number
    education: number
    housing: number
  }
  allowances: {
    personal: number
    spouse: number
    children: number[]
  }
}

export interface TaxBracket {
  min: number
  max: number | null
  rate: number
}

export interface CalculationInput {
  // Rendimentos
  grossSalary: number
  independentIncome: number
  pension: number
  subsidies: {
    meal: number
    vacation: number
    christmas: number
  }
  
  // Estado civil e dependentes
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  dependents: number
  
  // Deduções
  deductions: {
    health: number
    education: number
    housing: number
    donations: number
    other: number
  }
  
  // Retenções
  withholdingTax: number
  
  // Regime
  regime: 'simplified' | 'organized'
}

export interface CalculatorFormData {
  // Personal Data
  civilStatus?: 'single' | 'married' | 'divorced'
  isResident?: boolean
  dependents?: number
  disabledDependents?: number
  
  // Income
  employmentIncome?: number
  businessIncome?: number
  investmentIncome?: number
  propertyIncome?: number
  otherIncome?: number
  
  // Deductions
  healthExpenses?: number
  educationExpenses?: number
  housingExpenses?: number
  donations?: number
  withholdingTax?: number
  
  // Other
  regime?: 'simplified' | 'organized'
}

export interface CalculationResult {
  grossIncome: number
  taxableIncome: number
  taxDue: number
  withheld: number
  refundOrPayment: number
  effectiveRate: number
  marginalRate: number
  breakdown: {
    deductions: {
      personal: number
      spouse: number
      dependents: number
      health: number
      education: number
      housing: number
      donations: number
      other: number
      total: number
    }
    tax: {
      beforeCredits: number
      credits: number
      final: number
    }
  }
}

export interface User {
  id: string
  email: string
  isAdmin: boolean
  createdAt: Date
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  publishedAt: Date
  tags: string[]
  featured: boolean
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface Analytics {
  pageViews: number
  uniqueVisitors: number
  calculationsCompleted: number
  pdfGenerated: number
  topPages: Array<{
    path: string
    views: number
  }>
  referrers: Array<{
    source: string
    visits: number
  }>
}