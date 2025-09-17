'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Calculator, ArrowRight, ArrowLeft, Info, FileText, Download, Share } from 'lucide-react'
import { useCalculator } from '@/hooks/useCalculator'
import type { CalculatorFormData } from '@/types'
import { generateIRSPDF, shareCalculation, saveCalculationData, IRSCalculationData } from '@/lib/pdfGenerator'

const STEPS = [
  { id: 1, title: 'Dados Pessoais', description: 'Informações básicas sobre o contribuinte' },
  { id: 2, title: 'Rendimentos', description: 'Rendimentos do trabalho e outras fontes' },
  { id: 3, title: 'Deduções', description: 'Despesas dedutíveis e benefícios fiscais' },
  { id: 4, title: 'Resultado', description: 'Cálculo final do IRS a pagar ou receber' }
]

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step.id <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.id}
            </div>
            <div className="ml-3 hidden sm:block">
              <span className={`text-sm font-medium ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              <p className="text-xs text-gray-500 max-w-24">
                {step.description}
              </p>
            </div>
          </div>
          {index < totalSteps - 1 && (
            <div className={`flex-1 h-1 mx-4 ${
              step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PersonalDataStep({ formData, updateFormData }: { 
  formData: CalculatorFormData
  updateFormData: (data: Partial<CalculatorFormData>) => void 
}) {
  return (
    <div className="space-y-6">
      {/* Civil Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Estado Civil *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'single', label: 'Solteiro(a)' },
            { value: 'married', label: 'Casado(a)' },
            { value: 'divorced', label: 'Divorciado(a)' }
          ].map((option) => (
            <label 
              key={option.value}
              className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.civilStatus === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="civilStatus"
                value={option.value}
                checked={formData.civilStatus === option.value}
                onChange={(e) => updateFormData({ civilStatus: e.target.value as 'single' | 'married' | 'divorced' })}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                formData.civilStatus === option.value
                  ? 'border-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.civilStatus === option.value && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tax Residence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Residência Fiscal *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { 
              value: true, 
              label: 'Residente em Portugal',
              description: 'Permanece em Portugal mais de 183 dias por ano'
            },
            { 
              value: false, 
              label: 'Não Residente',
              description: 'Obtém rendimentos em Portugal mas não é residente fiscal'
            }
          ].map((option) => (
            <label 
              key={option.value.toString()}
              className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.isResident === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="isResident"
                value={option.value.toString()}
                checked={formData.isResident === option.value}
                onChange={(e) => updateFormData({ isResident: e.target.value === 'true' })}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded-full mr-3 mt-0.5 flex items-center justify-center ${
                formData.isResident === option.value
                  ? 'border-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.isResident === option.value && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <div>
                <span className="text-sm font-medium block">{option.label}</span>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Dependents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Dependentes
          </label>
          <Select 
            value={formData.dependents?.toString() || '0'} 
            onChange={(e) => updateFormData({ dependents: parseInt(e.target.value) })}
          >
            <option value="0">0 dependentes</option>
            <option value="1">1 dependente</option>
            <option value="2">2 dependentes</option>
            <option value="3">3 dependentes</option>
            <option value="4">4 ou mais dependentes</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dependentes com Deficiência
          </label>
          <Select 
            value={formData.disabledDependents?.toString() || '0'} 
            onChange={(e) => updateFormData({ disabledDependents: parseInt(e.target.value) })}
          >
            <option value="0">0 dependentes</option>
            <option value="1">1 dependente</option>
            <option value="2">2 dependentes</option>
            <option value="3">3 ou mais dependentes</option>
          </Select>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Informação sobre Dependentes
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Filhos menores de 25 anos sem rendimentos superiores ao SMN</li>
              <li>• Cônjuge sem rendimentos ou com rendimentos muito baixos</li>
              <li>• Ascendentes com mais de 65 anos a cargo</li>
              <li>• Dependentes com deficiência têm benefícios fiscais adicionais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function IncomeStep({ formData, updateFormData }: { 
  formData: CalculatorFormData
  updateFormData: (data: Partial<CalculatorFormData>) => void 
}) {
  return (
    <div className="space-y-6">
      {/* Employment Income */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rendimentos do Trabalho (Categoria A) *
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.employmentIncome || ''}
            onChange={(e) => updateFormData({ employmentIncome: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Salários, subsídios, prémios e outras remunerações do trabalho dependente
        </p>
      </div>

      {/* Business Income */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rendimentos Empresariais (Categoria B)
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.businessIncome || ''}
            onChange={(e) => updateFormData({ businessIncome: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Rendimentos de atividades empresariais, comerciais, industriais ou agrícolas
        </p>
      </div>

      {/* Investment Income */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rendimentos de Capitais (Categoria E)
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.investmentIncome || ''}
            onChange={(e) => updateFormData({ investmentIncome: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Juros, dividendos, rendas e outros rendimentos de aplicações financeiras
        </p>
      </div>

      {/* Property Income */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rendimentos Prediais (Categoria F)
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.propertyIncome || ''}
            onChange={(e) => updateFormData({ propertyIncome: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Rendas de imóveis, valor patrimonial tributário e outros rendimentos imobiliários
        </p>
      </div>

      {/* Information Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Dica: Como encontrar os seus rendimentos
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Categoria A:</strong> Consulte o seu recibo de vencimento</li>
              <li>• <strong>Categoria B:</strong> Soma dos lucros da atividade empresarial</li>
              <li>• <strong>Categoria E:</strong> Extratos bancários com juros, dividendos</li>
              <li>• <strong>Categoria F:</strong> Contratos de arrendamento, VPT dos imóveis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeductionsStep({ formData, updateFormData }: { 
  formData: CalculatorFormData
  updateFormData: (data: Partial<CalculatorFormData>) => void 
}) {
  return (
    <div className="space-y-6">
      {/* Health Expenses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Despesas de Saúde
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.healthExpenses || ''}
            onChange={(e) => updateFormData({ healthExpenses: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Consultas, medicamentos, tratamentos dentários, óculos e outras despesas médicas
        </p>
      </div>

      {/* Education Expenses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Despesas de Educação
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.educationExpenses || ''}
            onChange={(e) => updateFormData({ educationExpenses: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Propinas, material escolar, livros e outras despesas de formação
        </p>
      </div>

      {/* Housing Expenses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Despesas de Habitação
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.housingExpenses || ''}
            onChange={(e) => updateFormData({ housingExpenses: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Juros de empréstimo habitação, renda de casa, obras de reabilitação
        </p>
      </div>

      {/* Donations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donativos
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.donations || ''}
            onChange={(e) => updateFormData({ donations: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Donativos a IPSS, bombeiros, misericórdias e outras entidades
        </p>
      </div>

      {/* Withholding Tax */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IRS Retido na Fonte *
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0,00"
            value={formData.withholdingTax || ''}
            onChange={(e) => updateFormData({ withholdingTax: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            min="0"
            step="0.01"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Total de IRS retido pelo empregador durante o ano (consulte o recibo de vencimento)
        </p>
      </div>

      {/* Tax Regime */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Regime de Tributação
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { 
              value: 'simplified', 
              label: 'Regime Simplificado',
              description: 'Dedução automática de 4104€ (mais vantajoso para a maioria)'
            },
            { 
              value: 'organized', 
              label: 'Regime Organizado',
              description: 'Dedução das despesas efetivas que comprovou'
            }
          ].map((option) => (
            <label 
              key={option.value}
              className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.regime === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="regime"
                value={option.value}
                checked={formData.regime === option.value}
                onChange={(e) => updateFormData({ regime: e.target.value as 'simplified' | 'organized' })}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded-full mr-3 mt-0.5 flex items-center justify-center ${
                formData.regime === option.value
                  ? 'border-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.regime === option.value && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <div>
                <span className="text-sm font-medium block">{option.label}</span>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-orange-800 mb-2">
              Dicas para Maximizar as Deduções
            </h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• <strong>Saúde:</strong> Guarde todas as faturas médicas com NIF</li>
              <li>• <strong>Educação:</strong> Inclua propinas, livros e material escolar</li>
              <li>• <strong>Habitação:</strong> Juros de crédito habitação são dedutíveis</li>
              <li>• <strong>Donativos:</strong> Máximo de 0.6% do rendimento coletável</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultsStep({ formData }: { 
  formData: CalculatorFormData
}) {
  const [calculation, setCalculation] = useState<{
    refundOrPayment: number;
    effectiveRate: number;
    marginalRate: number;
    grossIncome: number;
    taxableIncome: number;
    taxDue: number;
    withheld: number;
    breakdown?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const calculateTax = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employmentIncome: formData.employmentIncome || 0,
          businessIncome: formData.businessIncome || 0,
          investmentIncome: formData.investmentIncome || 0,
          propertyIncome: formData.propertyIncome || 0,
          otherIncome: formData.otherIncome || 0,
          isResident: formData.isResident ?? true,
          dependents: formData.dependents || 0,
          disabledDependents: formData.disabledDependents || 0,
          civilStatus: formData.civilStatus || 'single',
          deductions: {
            health: formData.healthExpenses || 0,
            education: formData.educationExpenses || 0,
            housing: formData.housingExpenses || 0,
            donations: formData.donations || 0,
          },
          withholdingTax: formData.withholdingTax || 0,
          regime: formData.regime || 'simplified'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setCalculation(result.calculation)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao calcular o IRS')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [formData])

  const handleGeneratePDF = async () => {
    if (!calculation) return
    
    setPdfLoading(true)
    try {
      const pdfData: IRSCalculationData = {
        calculation,
        formData
      }
      await generateIRSPDF(pdfData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleShare = async () => {
    if (!calculation) return
    
    try {
      const shareData: IRSCalculationData = {
        calculation,
        formData
      }
      await shareCalculation(shareData)
    } catch (error) {
      console.error('Error sharing:', error)
      alert('Erro ao partilhar. Tente novamente.')
    }
  }

  const handleSaveData = () => {
    if (!calculation) return
    
    try {
      const saveData: IRSCalculationData = {
        calculation,
        formData
      }
      saveCalculationData(saveData)
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Erro ao guardar dados. Tente novamente.')
    }
  }

  useEffect(() => {
    calculateTax()
  }, [calculateTax])

  if (loading) {
    return (
      <div className="text-center py-12">
        <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">A calcular o seu IRS...</h3>
        <p className="text-gray-600">Aguarde enquanto processamos os seus dados</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro no Cálculo</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={calculateTax} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!calculation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Dados insuficientes para calcular o IRS.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Main Result Card */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Resultado do Cálculo IRS 2025</h3>
        
        <div className="text-5xl font-bold mb-4">
          {calculation.refundOrPayment >= 0 ? (
            <span className="text-green-100">+{calculation.refundOrPayment?.toFixed(2)}€</span>
          ) : (
            <span className="text-red-100">{Math.abs(calculation.refundOrPayment)?.toFixed(2)}€</span>
          )}
        </div>
        
        <p className="text-xl opacity-90">
          {calculation.refundOrPayment >= 0 
            ? 'Valor a receber (reembolso)' 
            : 'Valor a pagar ao Estado'
          }
        </p>
        
        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-sm opacity-80">Taxa Efetiva</p>
            <p className="text-2xl font-bold">{(calculation.effectiveRate * 100)?.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Taxa Marginal</p>
            <p className="text-2xl font-bold">{(calculation.marginalRate * 100)?.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="flex items-center gap-2"
          onClick={handleGeneratePDF}
          disabled={pdfLoading}
        >
          <FileText className="h-5 w-5" />
          {pdfLoading ? 'A gerar PDF...' : 'Gerar Relatório PDF'}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          onClick={handleShare}
        >
          <Share className="h-5 w-5" />
          Partilhar Resultado
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          onClick={handleSaveData}
        >
          <Download className="h-5 w-5" />
          Guardar Dados
        </Button>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Informações Importantes</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Este cálculo é uma simulação baseada nos parâmetros fiscais de 2025</li>
              <li>• Para uma declaração oficial, consulte sempre a Autoridade Tributária</li>
              <li>• Mantenha todos os comprovativos das despesas declaradas</li>
              <li>• Os prazos de entrega da declaração de IRS decorrem entre 1 de abril e 30 de junho</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CalculatorWizard() {
  const { formData, updateFormData } = useCalculator()
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.civilStatus && formData.isResident !== undefined)
      case 2:
        const hasIncome = (formData.employmentIncome || 0) + (formData.businessIncome || 0) + 
                         (formData.investmentIncome || 0) + (formData.propertyIncome || 0) + 
                         (formData.otherIncome || 0) > 0
        return hasIncome
      case 3:
        return true // Deductions are optional
      case 4:
        return true // Results step doesn't need validation
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDataStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <IncomeStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <DeductionsStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <ResultsStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Calculadora IRS 2025
            </h1>
          </div>
          <p className="text-gray-600">
            Siga os passos para calcular o seu IRS de forma simples e precisa
          </p>
        </div>

        {/* Progress Steps */}
        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} />

        {/* Calculator Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Passo {currentStep}: {STEPS[currentStep - 1].title}
            </CardTitle>
            <p className="text-gray-600">
              {STEPS[currentStep - 1].description}
            </p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            {/* Navigation */}
            <div className="flex justify-between pt-8 mt-8 border-t">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <Button 
                onClick={nextStep}
                disabled={currentStep === STEPS.length || !isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                {currentStep === STEPS.length ? 'Calcular IRS' : 'Próximo'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Passo {currentStep} de {STEPS.length} • Os seus dados são guardados automaticamente
        </div>
      </div>
    </div>
  )
}