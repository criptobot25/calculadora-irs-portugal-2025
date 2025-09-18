import { NextResponse } from 'next/server'
import { HybridIntelligentAI } from '@/lib/hybridAI'

// Temporariamente habilitado para testes de robustez
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem inválida' },
        { status: 400 }
      )
    }
    
    const ai = new HybridIntelligentAI()
    const response = await ai.processMessage(message)
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('Erro na API AI:', error)
    return NextResponse.json(
      { 
        message: 'Desculpe, houve um erro temporário. Pode reformular a sua pergunta?',
        extractedData: {},
        confidence: 0.1,
        sources: [],
        mlInsights: ['💡 Tente novamente com mais detalhes']
      },
      { status: 200 }
    )
  }
}