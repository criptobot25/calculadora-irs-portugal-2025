import { NextRequest, NextResponse } from 'next/server'
import { calculateIRS, validateCalculationInput } from '@/lib/taxCalculations'
import { CalculationInput } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Transform CalculatorFormData to CalculationInput format
    const transformedInput: CalculationInput = {
      grossSalary: body.employmentIncome || 0,
      independentIncome: (body.businessIncome || 0) + (body.otherIncome || 0),
      pension: 0, // Pension income would be part of employment income in this context
      subsidies: {
        meal: 0,
        vacation: 0,
        christmas: 0
      },
      maritalStatus: body.civilStatus === 'single' ? 'single' : 
                    body.civilStatus === 'married' ? 'married' : 
                    body.civilStatus === 'divorced' ? 'divorced' : 'single',
      dependents: body.dependents || 0,
      deductions: {
        health: body.deductions?.health || body.healthExpenses || 0,
        education: body.deductions?.education || body.educationExpenses || 0,
        housing: body.deductions?.housing || body.housingExpenses || 0,
        donations: body.deductions?.donations || body.donations || 0,
        other: 0
      },
      withholdingTax: body.withholdingTax || 0,
      regime: body.regime || 'simplified'
    }
    
    // Validate input
    const errors = validateCalculationInput(transformedInput)
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      )
    }
    
    // Calculate IRS
    const calculation = calculateIRS(transformedInput)
    
    // Log calculation for analytics (anonymized)
    console.log('IRS calculation performed:', {
      timestamp: new Date().toISOString(),
      grossIncome: transformedInput.grossSalary,
      maritalStatus: transformedInput.maritalStatus,
      dependents: transformedInput.dependents,
      calculated: true
    })
    
    return NextResponse.json({
      success: true,
      calculation,
      timestamp: new Date().toISOString(),
      disclaimer: 'Resultados estimados para fins informativos. Consulte um contabilista para casos complexos.'
    })
    
  } catch (error) {
    console.error('Error calculating IRS:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de cálculo de IRS',
    version: '1.0.0',
    endpoints: {
      calculate: 'POST /api/calculate - Calculate IRS',
      parameters: 'GET /api/parameters - Get tax parameters'
    }
  })
}