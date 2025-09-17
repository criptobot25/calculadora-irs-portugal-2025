import jsPDF from 'jspdf'

export interface IRSCalculationData {
  calculation: {
    refundOrPayment: number
    effectiveRate: number
    marginalRate: number
    grossIncome: number
    taxableIncome: number
    taxDue: number
    withheld: number
    breakdown?: {
      deductions: {
        personal: number
        spouse: number
        dependents: number
        health: number
        education: number
        housing: number
        donations: number
      }
    }
  }
  formData: {
    civilStatus?: string
    isResident?: boolean
    dependents?: number
    employmentIncome?: number
    businessIncome?: number
    investmentIncome?: number
    propertyIncome?: number
    otherIncome?: number
    healthExpenses?: number
    educationExpenses?: number
    housingExpenses?: number
    donations?: number
    withholdingTax?: number
    regime?: string
  }
}

export const generateIRSPDF = async (data: IRSCalculationData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Constants
  const pageWidth = pdf.internal.pageSize.width
  const pageHeight = pdf.internal.pageSize.height
  const margin = 20
  const lineHeight = 7
  let yPosition = margin
  
  // Helper function to add text with automatic line breaks
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number, fontStyle?: string, align?: 'left' | 'center' | 'right' }) => {
    if (options?.fontSize) {
      pdf.setFontSize(options.fontSize)
    }
    if (options?.fontStyle) {
      pdf.setFont('helvetica', options.fontStyle)
    }
    
    const maxWidth = pageWidth - 2 * margin
    const lines = pdf.splitTextToSize(text, maxWidth)
    
    lines.forEach((line: string, index: number) => {
      const lineY = y + (index * lineHeight)
      if (options?.align === 'center') {
        pdf.text(line, pageWidth / 2, lineY, { align: 'center' })
      } else if (options?.align === 'right') {
        pdf.text(line, pageWidth - margin, lineY, { align: 'right' })
      } else {
        pdf.text(line, x, lineY)
      }
    })
    
    return y + (lines.length * lineHeight)
  }
  
  // Header
  pdf.setFillColor(59, 130, 246) // Blue-600
  pdf.rect(0, 0, pageWidth, 25, 'F')
  
  pdf.setTextColor(255, 255, 255)
  yPosition = addText('RELATÓRIO DE CÁLCULO IRS 2025', margin, 15, { fontSize: 18, fontStyle: 'bold', align: 'center' })
  
  // Reset text color
  pdf.setTextColor(0, 0, 0)
  yPosition = 35
  
  // Date
  const currentDate = new Date().toLocaleDateString('pt-PT')
  yPosition = addText(`Data: ${currentDate}`, margin, yPosition, { fontSize: 10 }) + 5
  
  // Main result section
  yPosition = addText('RESULTADO PRINCIPAL', margin, yPosition, { fontSize: 14, fontStyle: 'bold' }) + 5
  
  const isRefund = data.calculation.refundOrPayment >= 0
  const resultText = isRefund 
    ? `Valor a receber (reembolso): +${data.calculation.refundOrPayment.toFixed(2)}€`
    : `Valor a pagar ao Estado: ${Math.abs(data.calculation.refundOrPayment).toFixed(2)}€`
  
  yPosition = addText(resultText, margin, yPosition, { fontSize: 12, fontStyle: 'bold' }) + 3
  
  yPosition = addText(`Taxa Efetiva: ${(data.calculation.effectiveRate * 100).toFixed(1)}%`, margin, yPosition) + 3
  yPosition = addText(`Taxa Marginal: ${(data.calculation.marginalRate * 100).toFixed(1)}%`, margin, yPosition) + 10
  
  // Income breakdown
  yPosition = addText('RENDIMENTOS', margin, yPosition, { fontSize: 14, fontStyle: 'bold' }) + 5
  
  const totalIncome = (data.formData.employmentIncome || 0) + 
                     (data.formData.businessIncome || 0) + 
                     (data.formData.investmentIncome || 0) + 
                     (data.formData.propertyIncome || 0) + 
                     (data.formData.otherIncome || 0)
  
  yPosition = addText(`Rendimento Total: ${totalIncome.toFixed(2)}€`, margin, yPosition, { fontStyle: 'bold' }) + 3
  
  if (data.formData.employmentIncome) {
    yPosition = addText(`• Rendimentos do Trabalho (Categoria A): ${data.formData.employmentIncome.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.businessIncome) {
    yPosition = addText(`• Rendimentos Empresariais (Categoria B): ${data.formData.businessIncome.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.investmentIncome) {
    yPosition = addText(`• Rendimentos de Investimento (Categoria E): ${data.formData.investmentIncome.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.propertyIncome) {
    yPosition = addText(`• Rendimentos Prediais (Categoria F): ${data.formData.propertyIncome.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.otherIncome) {
    yPosition = addText(`• Outros Rendimentos: ${data.formData.otherIncome.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  
  yPosition += 7
  
  // Deductions
  yPosition = addText('DEDUÇÕES', margin, yPosition, { fontSize: 14, fontStyle: 'bold' }) + 5
  
  const totalDeductions = (data.formData.healthExpenses || 0) + 
                         (data.formData.educationExpenses || 0) + 
                         (data.formData.housingExpenses || 0) + 
                         (data.formData.donations || 0)
  
  yPosition = addText(`Total de Deduções: ${totalDeductions.toFixed(2)}€`, margin, yPosition, { fontStyle: 'bold' }) + 3
  
  if (data.formData.healthExpenses) {
    yPosition = addText(`• Despesas de Saúde: ${data.formData.healthExpenses.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.educationExpenses) {
    yPosition = addText(`• Despesas de Educação: ${data.formData.educationExpenses.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.housingExpenses) {
    yPosition = addText(`• Despesas de Habitação: ${data.formData.housingExpenses.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  if (data.formData.donations) {
    yPosition = addText(`• Donativos: ${data.formData.donations.toFixed(2)}€`, margin + 5, yPosition) + 3
  }
  
  yPosition += 7
  
  // Personal information
  yPosition = addText('INFORMAÇÕES PESSOAIS', margin, yPosition, { fontSize: 14, fontStyle: 'bold' }) + 5
  
  const civilStatusMap: Record<string, string> = {
    'single': 'Solteiro(a)',
    'married': 'Casado(a)',
    'divorced': 'Divorciado(a)'
  }
  
  yPosition = addText(`Estado Civil: ${civilStatusMap[data.formData.civilStatus || 'single'] || 'Não especificado'}`, margin, yPosition) + 3
  yPosition = addText(`Residente: ${data.formData.isResident ? 'Sim' : 'Não'}`, margin, yPosition) + 3
  yPosition = addText(`Dependentes: ${data.formData.dependents || 0}`, margin, yPosition) + 3
  yPosition = addText(`Regime: ${data.formData.regime === 'simplified' ? 'Simplificado' : 'Organizado'}`, margin, yPosition) + 3
  
  if (data.formData.withholdingTax) {
    yPosition = addText(`Retenção na Fonte: ${data.formData.withholdingTax.toFixed(2)}€`, margin, yPosition) + 3
  }
  
  yPosition += 10
  
  // Footer disclaimer
  if (yPosition > pageHeight - 40) {
    pdf.addPage()
    yPosition = margin
  }
  
  yPosition = addText('AVISO LEGAL', margin, yPosition, { fontSize: 12, fontStyle: 'bold' }) + 5
  
  const disclaimer = `Este relatório é uma simulação baseada nos dados fornecidos e nos parâmetros fiscais de 2025. 
Os resultados são estimados e destinam-se apenas a fins informativos. Para uma declaração oficial de IRS, 
consulte sempre um contabilista certificado ou a Autoridade Tributária e Aduaneira. 
Mantenha todos os comprovativos das despesas declaradas.`
  
  yPosition = addText(disclaimer, margin, yPosition, { fontSize: 9 })
  
  // Footer
  const footerY = pageHeight - 15
  pdf.setFontSize(8)
  pdf.setTextColor(128, 128, 128)
  pdf.text('Gerado por Calculadora IRS 2025 - calculadora-irs.pt', pageWidth / 2, footerY, { align: 'center' })
  
  // Save the PDF
  pdf.save(`relatorio-irs-2025-${currentDate.replace(/\//g, '-')}.pdf`)
}

export const shareCalculation = async (data: IRSCalculationData): Promise<void> => {
  if (navigator.share) {
    const shareData = {
      title: 'Resultado Cálculo IRS 2025',
      text: `O meu cálculo de IRS resultou em: ${data.calculation.refundOrPayment >= 0 ? 
        `+${data.calculation.refundOrPayment.toFixed(2)}€ de reembolso` : 
        `${Math.abs(data.calculation.refundOrPayment).toFixed(2)}€ a pagar`}`,
      url: window.location.href
    }
    
    try {
      await navigator.share(shareData)
    } catch {
      // Fallback to clipboard
      await copyToClipboard(shareData.text + ' - ' + shareData.url)
    }
  } else {
    // Fallback to clipboard
    const text = `Resultado Cálculo IRS 2025: ${data.calculation.refundOrPayment >= 0 ? 
      `+${data.calculation.refundOrPayment.toFixed(2)}€ de reembolso` : 
      `${Math.abs(data.calculation.refundOrPayment).toFixed(2)}€ a pagar`} - ${window.location.href}`
    
    await copyToClipboard(text)
  }
}

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    alert('Link copiado para a área de transferência!')
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Link copiado para a área de transferência!')
  }
}

export const saveCalculationData = (data: IRSCalculationData): void => {
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `calculo-irs-2025-${new Date().toISOString().split('T')[0]}.json`
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}