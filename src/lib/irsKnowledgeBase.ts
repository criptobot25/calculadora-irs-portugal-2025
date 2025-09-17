// lib/irsKnowledgeBase.ts - Base de Conhecimento Completa do IRS Português 2024/2025
export const IRS_KNOWLEDGE_BASE = {
  // Escalões de IRS 2024 - Portugal Continental
  taxBrackets: {
    continental: [
      { min: 0, max: 7703, rate: 0.145, parcela: 0 },
      { min: 7703, max: 11623, rate: 0.23, parcela: 654.755 },
      { min: 11623, max: 16472, rate: 0.285, parcela: 1293.765 },
      { min: 16472, max: 21321, rate: 0.35, parcela: 2364.485 },
      { min: 21321, max: 26451, rate: 0.37, parcela: 2791.205 },
      { min: 26451, max: 38632, rate: 0.45, parcela: 4908.285 },
      { min: 38632, max: 50483, rate: 0.485, parcela: 6260.405 },
      { min: 50483, max: 78834, rate: 0.50, parcela: 7017.785 },
      { min: 78834, max: Infinity, rate: 0.53, parcela: 9382.005 }
    ],
    // Madeira e Açores têm taxas diferentes
    madeira: [
      { min: 0, max: 7703, rate: 0.1305, parcela: 0 },
      { min: 7703, max: 11623, rate: 0.207, parcela: 589.2795 },
      // ... (escalões específicos das regiões autónomas)
    ]
  },

  // Deduções à coleta
  deductions: {
    // Mínimo de existência
    personal: {
      single: 4104,
      married_separate: 4104,
      married_joint: 4104, // por cônjuge
      senior_over65: 1020, // adicional
      disability: 1890 // portadores de deficiência
    },

    // Dependentes
    dependents: {
      first_two_children: 600, // por cada um dos primeiros 2 filhos
      additional_children: 750, // por cada filho adicional
      disabled_dependent: 1890, // adicional por dependente deficiente
      elderly_dependent: 600, // ascendente com mais de 65 anos
      student_over25: 600 // estudante universitário com mais de 25 anos
    },

    // Despesas dedutíveis
    expenses: {
      health: {
        rate: 0.15, // 15% das despesas
        min_deduction: 0,
        max_deduction: null, // sem limite
        family_limit: 1000, // limite para agregado familiar alargado
        includes: [
          'Consultas médicas',
          'Medicamentos com receita',
          'Tratamentos dentários',
          'Óculos e lentes',
          'Próteses e ortóteses',
          'Fisioterapia',
          'Psicologia clínica',
          'Medicina alternativa (com fatura)'
        ]
      },

      education: {
        rate: 0.30, // 30% das despesas
        max_deduction: 800, // limite anual
        includes: [
          'Propinas do ensino superior',
          'Material escolar',
          'Livros escolares',
          'Cursos de formação profissional',
          'Creches e jardins de infância',
          'ATL (Atividades de Tempos Livres)'
        ]
      },

      housing: {
        acquisition: {
          rate: 0.15, // 15% dos juros
          max_deduction: 296, // limite anual
          conditions: ['Habitação própria permanente', 'Primeiro empréstimo']
        },
        rehabilitation: {
          rate: 0.30, // 30% das despesas
          max_deduction: 500, // limite anual
          conditions: ['Obras de reabilitação', 'Imóvel com mais de 30 anos']
        },
        rent: {
          rate: 0.15, // 15% da renda
          max_deduction: 502, // limite anual
          age_limit: 30, // apenas jovens até 30 anos ou idosos
          conditions: ['Arrendamento para habitação permanente']
        }
      },

      donations: {
        rate: 0.25, // 25% das doações
        max_rate_income: 0.015, // máximo 1,5% do rendimento
        religious_rate: 0.25,
        includes: [
          'Cruz Vermelha',
          'Bombeiros Voluntários', 
          'Misericórdias',
          'IPSS',
          'Partidos políticos',
          'Sindicatos',
          'Organizações religiosas'
        ]
      },

      retirement: {
        ppr: {
          max_deduction: 400, // limite anual para PPR
          age_over65: 800, // limite para maiores de 65 anos
          conditions: ['Plano Poupança Reforma']
        },
        pension_funds: {
          rate: 0.25, // 25% das contribuições
          max_deduction: 350
        }
      }
    }
  },

  // Regimes de tributação
  taxRegimes: {
    simplified: {
      name: 'Regime Simplificado',
      description: 'Dedução automática de 20% para Categoria A, 75% para Categoria B',
      deduction_rates: {
        category_a: 0.20, // trabalho dependente
        category_b: 0.75, // empresarial/profissional
        category_f: 0.20  // predial
      },
      requirements: 'Automático se não optar pelo regime organizado'
    },
    organized: {
      name: 'Regime Organizado',
      description: 'Dedução das despesas comprovadas',
      requirements: 'Opção expressa na declaração',
      advantages: 'Pode ser mais vantajoso com muitas despesas'
    }
  },

  // Benefícios fiscais específicos
  fiscalBenefits: {
    firstHome: {
      name: 'Benefício Fiscal - Primeira Habitação',
      deduction: 'Juros do empréstimo habitação',
      rate: 0.15,
      max_amount: 296,
      conditions: ['Idade inferior a 35 anos', 'Primeira aquisição']
    },
    youthRental: {
      name: 'Benefício Fiscal - Arrendamento Jovem',
      deduction: 'Rendas pagas',
      rate: 0.15,
      max_amount: 502,
      conditions: ['Idade até 30 anos', 'Rendimento até 25.000€']
    },
    seniorsRental: {
      name: 'Benefício Fiscal - Arrendamento Sénior',
      deduction: 'Rendas pagas',
      rate: 0.15,
      max_amount: 502,
      conditions: ['Idade superior a 65 anos']
    },
    disabilities: {
      name: 'Benefícios para Pessoas com Deficiência',
      deductions: ['Dedução à coleta adicional', 'Despesas específicas'],
      conditions: ['Grau de incapacidade ≥ 60%']
    }
  },

  // Situações especiais
  specialSituations: {
    unemployment: {
      name: 'Subsídio de Desemprego',
      taxation: 'Sujeito a IRS como rendimento Categoria A',
      withholding: 'Retenção na fonte aplicável'
    },
    pension: {
      name: 'Pensões de Reforma',
      taxation: 'Categoria H - escalões específicos',
      minimum_pension: 'Pensão mínima isenta até certo valor'
    },
    non_resident: {
      name: 'Não Residentes',
      taxation: 'Taxa liberatória de 25% ou integração no IRS',
      conditions: 'Rendimentos obtidos em Portugal'
    }
  },

  // Prazos e obrigações
  deadlines: {
    declaration: {
      start: '1 de abril',
      end: '30 de junho',
      extension: '31 de agosto (com penalização)'
    },
    payment: {
      voluntary: 'Até 30 de junho',
      automatic_debit: 'Agosto/setembro em prestações',
      additional_payment: 'Novembro/dezembro se aplicável'
    }
  },

  // Expressões em português para reconhecimento
  naturalLanguage: {
    incomeKeywords: [
      'salário', 'vencimento', 'ordenado', 'ganho', 'recebo', 'auferido',
      'rendimento', 'remuneração', 'subsídio', 'prémio', 'comissão',
      'trabalho', 'emprego', 'empresa', 'patrão', 'chefe', 'bruto', 'líquido',
      'anual', 'mensal', 'por mês', 'ao ano', 'euros', 'mil euros'
    ],
    
    monetaryPatterns: [
      // Padrões básicos com euros
      /(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(?:euros?|€)\s*(\d+(?:[.,]\d+)?)/gi,
      
      // Padrões com "k" para milhares
      /(\d+(?:[.,]\d+)?)k/gi,
      
      // Padrões de contexto
      /(?:salário|vencimento|ganho|recebo).*?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€).*?(?:salário|vencimento|por mês)/gi
    ],
    
    expenseKeywords: {
      health: [
        'saúde', 'médico', 'medicina', 'hospital', 'clínica', 'farmácia',
        'dentista', 'oftalmologista', 'consulta', 'medicamento', 'óculos',
        'fisioterapia', 'psicólogo', 'análises', 'exames', 'cirurgia',
        'gastei com médico', 'paguei ao dentista', 'fui ao hospital',
        'comprei medicamentos', 'receita médica', 'seguro de saúde'
      ],
      education: [
        'educação', 'escola', 'universidade', 'colégio', 'propina', 'livros',
        'material escolar', 'creche', 'jardim de infância', 'ATL',
        'formação', 'curso', 'explicações', 'estudo', 'mensalidade',
        'paguei propinas', 'escola dos filhos', 'livros escolares',
        'material para escola', 'curso de formação', 'mestrado', 'licenciatura'
      ],
      housing: [
        'casa', 'habitação', 'empréstimo', 'prestação', 'juros', 'crédito',
        'obras', 'remodelação', 'renda', 'arrendamento', 'aluguer',
        'prestação da casa', 'empréstimo habitação', 'crédito à habitação',
        'pago prestação', 'juros do empréstimo', 'obras em casa', 'renda de casa'
      ]
    },

    civilStatusKeywords: {
      single: [
        'solteiro', 'solteira', 'não casado', 'não casada', 'sozinho', 'sozinha',
        'pessoa solteira', 'vida de solteiro', 'não tenho cônjuge', 'sem marido', 'sem esposa'
      ],
      married: [
        'casado', 'casada', 'esposa', 'marido', 'cônjuge', 'união de facto',
        'vivo junto', 'companheiro', 'companheira', 'minha mulher', 'meu marido',
        'casamento', 'casei', 'tenho esposa', 'tenho marido'
      ],
      divorced: [
        'divorciado', 'divorciada', 'separado', 'separada', 'ex-marido', 'ex-esposa',
        'divórcio', 'separação', 'já fui casado', 'já fui casada'
      ]
    },

    dependentsKeywords: [
      // Números diretos
      'um filho', 'uma filha', 'dois filhos', 'duas filhas', 'três filhos',
      'quatro filhos', 'cinco filhos', 'seis filhos',
      
      // Padrões com números
      'tenho 1 filho', 'tenho 2 filhos', 'tenho 3 filhos', 'tenho 4 filhos',
      'sou pai de', 'sou mãe de', 'pai de dois', 'mãe de três',
      
      // Negações
      'não tenho filhos', 'sem filhos', 'zero filhos', 'nenhum filho',
      'não sou pai', 'não sou mãe', 'sem dependentes', 'não tenho dependentes'
    ],

    familyKeywords: [
      'filho', 'filha', 'filhos', 'criança', 'dependente', 'família',
      'cônjuge', 'esposa', 'marido', 'casado', 'casada', 'solteiro',
      'divorciado', 'viúvo', 'ascendente', 'pai', 'mãe'
    ],

    amountPatterns: [
      /(\d+(?:[.,]\d+)?)\s*(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:mil\s*euros?|mil\s*€)/gi,
      /(?:euros?|€)\s*(\d+(?:[.,]\d+)?)/gi
    ],

    frequencyPatterns: [
      /(?:por|ao)\s*(?:mês|mensal|mensalmente)/gi,
      /(?:por|ao)\s*(?:ano|anual|anualmente)/gi,
      /(?:por|ao)\s*(?:semana|semanal)/gi
    ]
  },

  // Validações e verificações
  validations: {
    income: {
      min: 0,
      max: 10000000, // limite máximo razoável
      currency: 'EUR'
    },
    dependents: {
      min: 0,
      max: 20 // limite máximo razoável
    },
    expenses: {
      min: 0,
      max_percentage_income: 0.90 // despesas não podem exceder 90% do rendimento
    }
  }
} as const

// Funções utilitárias para a base de conhecimento
export const IRS_UTILS = {
  // Calcular escalão de IRS
  calculateTaxBracket: (income: number, region: 'continental' | 'madeira' = 'continental') => {
    const brackets = region === 'madeira' 
      ? IRS_KNOWLEDGE_BASE.taxBrackets.madeira 
      : IRS_KNOWLEDGE_BASE.taxBrackets.continental
    return brackets.find((bracket: { min: number; max: number; rate: number; parcela: number }) => income >= bracket.min && income <= bracket.max)
  },

  // Calcular imposto bruto
  calculateGrossTax: (income: number, region: 'continental' | 'madeira' = 'continental') => {
    const bracket = IRS_UTILS.calculateTaxBracket(income, region)
    if (!bracket) return 0
    return income * bracket.rate - bracket.parcela
  },

  // Calcular deduções
  calculateDeductions: (data: {
    civilStatus?: string;
    dependents?: number;
    healthExpenses?: number;
    educationExpenses?: number;
    housingExpenses?: number;
    donations?: number;
  }) => {
    let totalDeductions = 0

    // Dedução pessoal
    totalDeductions += data.civilStatus === 'married' 
      ? IRS_KNOWLEDGE_BASE.deductions.personal.married_joint * 2
      : IRS_KNOWLEDGE_BASE.deductions.personal.single

    // Dependentes
    if (data.dependents) {
      const firstTwo = Math.min(data.dependents, 2) * IRS_KNOWLEDGE_BASE.deductions.dependents.first_two_children
      const additional = Math.max(0, data.dependents - 2) * IRS_KNOWLEDGE_BASE.deductions.dependents.additional_children
      totalDeductions += firstTwo + additional
    }

    // Despesas de saúde
    if (data.healthExpenses) {
      totalDeductions += data.healthExpenses * IRS_KNOWLEDGE_BASE.deductions.expenses.health.rate
    }

    // Despesas de educação
    if (data.educationExpenses) {
      const educationDeduction = Math.min(
        data.educationExpenses * IRS_KNOWLEDGE_BASE.deductions.expenses.education.rate,
        IRS_KNOWLEDGE_BASE.deductions.expenses.education.max_deduction
      )
      totalDeductions += educationDeduction
    }

    // Despesas de habitação
    if (data.housingExpenses) {
      const housingDeduction = Math.min(
        data.housingExpenses * IRS_KNOWLEDGE_BASE.deductions.expenses.housing.acquisition.rate,
        IRS_KNOWLEDGE_BASE.deductions.expenses.housing.acquisition.max_deduction
      )
      totalDeductions += housingDeduction
    }

    return totalDeductions
  },

  // Detectar se é vantajoso o regime organizado
  isOrganizedRegimeAdvantgeous: (income: number, expenses: {
    healthExpenses?: number;
    educationExpenses?: number;
    housingExpenses?: number;
    donations?: number;
  }) => {
    const simplifiedDeduction = income * 0.20 // 20% para Categoria A
    const organizedDeductions = IRS_UTILS.calculateDeductions(expenses)
    return organizedDeductions > simplifiedDeduction
  },

  // Sugestões inteligentes baseadas no perfil
  generateSmartSuggestions: (data: {
    employmentIncome?: number;
    dependents?: number;
    healthExpenses?: number;
    educationExpenses?: number;
    civilStatus?: string;
  }) => {
    const suggestions: string[] = []

    if (data.employmentIncome) {
      if (data.employmentIncome > 50000) {
        suggestions.push("💡 Com rendimentos elevados, considere contribuições para PPR")
        suggestions.push("💡 Verifique se o regime organizado é mais vantajoso")
      }

      if (data.employmentIncome < 15000) {
        suggestions.push("💡 Pode ter direito a benefícios fiscais específicos")
      }
    }

    if (data.dependents && data.dependents > 0) {
      suggestions.push("💡 Despesas de educação dos filhos são dedutíveis")
      suggestions.push("💡 ATL e creches também contam como despesas de educação")
    }

    if (data.civilStatus === 'married') {
      suggestions.push("💡 Avalie tributação conjunta vs separada")
    }

    if (!data.healthExpenses || data.healthExpenses === 0) {
      suggestions.push("💡 Consultas, medicamentos e óculos são dedutíveis")
    }

    return suggestions
  }
}