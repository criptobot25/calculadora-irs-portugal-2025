import { NextRequest, NextResponse } from 'next/server'
import { TAX_PARAMETERS_2025 } from '@/lib/taxCalculations'

export async function GET() {
  return NextResponse.json({
    success: true,
    parameters: TAX_PARAMETERS_2025,
    lastUpdated: '2024-12-17',
    source: 'Autoridade Tributária e Aduaneira'
  })
}

// This would be protected in a real application
export async function POST(request: NextRequest) {
  try {
    await request.json()
    
    // In a real application, you would:
    // 1. Verify admin authentication
    // 2. Validate the new parameters
    // 3. Store in database
    // 4. Return updated parameters
    
    return NextResponse.json({
      success: true,
      message: 'Parâmetros fiscais atualizados com sucesso',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating tax parameters:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar parâmetros' },
      { status: 500 }
    )
  }
}