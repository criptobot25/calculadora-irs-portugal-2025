'use client'

import IADemo from '@/components/IADemo'

export default function DemoIAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demonstração da Nossa IA Especializada
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como a nossa IA própria processa linguagem natural em português e extrai dados fiscais com precisão
          </p>
        </div>
        
        <IADemo />
      </div>
    </div>
  )
}