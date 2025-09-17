// components/IADemo.tsx - Demonstração das Capacidades da Nossa IA
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CustomIRSAI } from '@/lib/customIRS_AI'
import { IRSAIValidators } from '@/lib/irsAIValidators'
import { Bot, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react'

export default function IADemo() {
  const [ai] = useState(() => new CustomIRSAI())
  const [testResults, setTestResults] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isRunning, setIsRunning] = useState(false)

  const testCases = [
    {
      name: "Caso Simples - Solteiro",
      input: "Ganho 2500 euros por mês, sou solteiro e gastei 300 euros em médicos este ano",
      expected: { employmentIncome: 30000, civilStatus: 'single', healthExpenses: 300 }
    },
    {
      name: "Família com Filhos",
      input: "Sou casado, tenho 2 filhos, ganho 45000 euros anuais e gastei 800 em educação",
      expected: { employmentIncome: 45000, civilStatus: 'married', dependents: 2, educationExpenses: 800 }
    },
    {
      name: "Rendimentos Múltiplos",
      input: "Tenho um salário de 35000 euros e um negócio que me rende 15000 euros por ano",
      expected: { employmentIncome: 35000, businessIncome: 15000 }
    },
    {
      name: "Despesas Diversas", 
      input: "Solteira, ganho 28000 anuais, gastei 500 em saúde, 600 em educação e 200 em habitação",
      expected: { employmentIncome: 28000, civilStatus: 'single', healthExpenses: 500, educationExpenses: 600, housingExpenses: 200 }
    }
  ]

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    ai.reset()

    for (const testCase of testCases) {
      try {
        const response = await ai.processMessage(testCase.input)
        const validation = IRSAIValidators.validateFullData(response.extractedData || {})
        
        setTestResults(prev => [...prev, {
          name: testCase.name,
          input: testCase.input,
          response: response.message,
          extractedData: response.extractedData,
          expected: testCase.expected,
          validation,
          success: response.extractedData && Object.keys(response.extractedData).length > 0,
          confidence: response.confidence
        }])

        // Aguardar um pouco entre testes
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: testCase.name,
          input: testCase.input,
          error: error,
          success: false
        }])
      }
    }

    setIsRunning(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            Demonstração da Nossa IA Especializada em IRS
          </CardTitle>
          <p className="text-gray-600">
            Teste das capacidades da nossa IA própria para processamento de linguagem natural em português e extração de dados fiscais.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">100% Nossa</h3>
              <p className="text-sm text-gray-600">Desenvolvida internamente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Especializada</h3>
              <p className="text-sm text-gray-600">Foco em IRS português</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Info className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Inteligente</h3>
              <p className="text-sm text-gray-600">Validações e sugestões</p>
            </div>
          </div>

          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full mb-6"
            size="lg"
          >
            {isRunning ? 'Testando...' : 'Executar Testes da IA'}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Resultados dos Testes</h2>
          
          {testResults.map((result, index) => (
            <Card key={index} className={`border-l-4 ${result.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{result.name}</span>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    {result.confidence && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {(result.confidence * 100).toFixed(0)}% confiança
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Input do usuário */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Entrada do Usuário:</h4>
                  <p className="text-sm bg-gray-100 p-2 rounded italic">&quot;{result.input}&quot;</p>
                </div>

                {/* Resposta da IA */}
                {result.response && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Resposta da IA:</h4>
                    <p className="text-sm bg-blue-50 p-2 rounded">{result.response}</p>
                  </div>
                )}

                {/* Dados extraídos */}
                {result.extractedData && Object.keys(result.extractedData).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Dados Extraídos:</h4>
                    <div className="text-sm bg-green-50 p-2 rounded">
                      {Object.entries(result.extractedData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{typeof value === 'number' ? `${value}€` : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validação */}
                {result.validation && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Validação:</h4>
                    <div className="text-sm space-y-1">
                      {result.validation.errors.length > 0 && (
                        <div className="text-red-600">
                          Erros: {result.validation.errors.join(', ')}
                        </div>
                      )}
                      {result.validation.warnings.length > 0 && (
                        <div className="text-yellow-600">
                          Avisos: {result.validation.warnings.join(', ')}
                        </div>
                      )}
                      {result.validation.suggestions.length > 0 && (
                        <div className="text-blue-600">
                          Sugestões: {result.validation.suggestions.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Erro */}
                {result.error && (
                  <div>
                    <h4 className="font-semibold text-sm text-red-700 mb-1">Erro:</h4>
                    <p className="text-sm bg-red-50 p-2 rounded text-red-700">
                      {result.error.toString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Resumo dos testes */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo dos Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">Sucessos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.filter(r => !r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">Falhas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.length > 0 ? 
                      (testResults.reduce((acc, r) => acc + (r.confidence || 0), 0) / testResults.length * 100).toFixed(0) + '%'
                      : '0%'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Confiança Média</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}