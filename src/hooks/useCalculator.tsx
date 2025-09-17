'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CalculatorFormData } from '@/types'

interface CalculatorContextType {
  formData: CalculatorFormData
  updateFormData: (data: Partial<CalculatorFormData>) => void
  clearFormData: () => void
  currentStep: number
  setCurrentStep: (step: number) => void
  isFormValid: boolean
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined)

const STORAGE_KEY = 'irs-calculator-data'

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<CalculatorFormData>({})
  const [currentStep, setCurrentStep] = useState(0)

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setFormData(JSON.parse(saved))
        } catch (error) {
          console.error('Error loading saved form data:', error)
        }
      }
    }
  }, [])

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData])

  const updateFormData = (data: Partial<CalculatorFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const clearFormData = () => {
    setFormData({})
    setCurrentStep(0)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const isFormValid = Boolean(
    formData.employmentIncome &&
    formData.civilStatus &&
    typeof formData.dependents === 'number'
  )

  return (
    <CalculatorContext.Provider value={{
      formData,
      updateFormData,
      clearFormData,
      currentStep,
      setCurrentStep,
      isFormValid
    }}>
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}