import CalculatorWizard from '@/components/CalculatorWizard'

export const metadata = {
  title: 'Calculadora IRS - Simule o seu Imposto | IRS Portugal',
  description: 'Calcule o seu IRS de forma simples e gratuita. Simulador oficial com parâmetros atualizados para 2025.',
  openGraph: {
    title: 'Calculadora IRS - Simule o seu Imposto',
    description: 'Calcule o seu IRS de forma simples e gratuita. Simulador oficial com parâmetros atualizados para 2025.',
    type: 'website',
  },
}

export default function CalculatorPage() {
  return <CalculatorWizard />
}