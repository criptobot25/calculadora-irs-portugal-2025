import { NextResponse } from 'next/server'

// Esta rota não é mais necessária - IA funciona agora diretamente no cliente
// Mantida para compatibilidade
export async function POST() {
  return NextResponse.json(
    { 
      message: 'IA funciona agora diretamente no cliente com Google Gemini gratuito',
      status: 'deprecated' 
    },
    { status: 200 }
  )
}