// Teste das melhorias da IA
const fs = require('fs');
const path = require('path');

// Simular o ambiente da IA
const mockIRSKnowledge = {
  naturalLanguage: {
    incomeKeywords: ['salário', 'vencimento', 'ganho', 'recebo'],
    expenseKeywords: {
      health: ['médico', 'medicina', 'hospital'],
      education: ['educação', 'escola', 'propina'],
      housing: ['casa', 'prestação', 'empréstimo']
    },
    familyKeywords: ['filho', 'filha', 'casado', 'solteiro']
  }
};

// Simular classe de IA simplificada para teste
class TestAI {
  constructor() {
    this.irsKnowledge = mockIRSKnowledge;
  }

  parseAmount(str) {
    if (!str) return 0;
    
    // Remover espaços e verificar se tem "k"
    let cleaned = str.replace(/[^\d,.\s]/g, '').trim();
    const hasK = /\d+k/i.test(str);
    
    // Tratar diferentes formatos monetários
    if (cleaned.includes(',') && cleaned.includes('.')) {
      // Formato: 1.234,56 (português) ou 1,234.56 (inglês)
      if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
        // Vírgula é decimal: 1.234,56 -> 1234.56
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // Ponto é decimal: 1,234.56 -> 1234.56
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (cleaned.includes(',')) {
      // Apenas vírgula
      const parts = cleaned.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Vírgula como decimal: 1500,50 -> 1500.50
        cleaned = cleaned.replace(',', '.');
      } else {
        // Vírgula como milhares: 1,500 -> 1500
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (cleaned.includes('.')) {
      // Apenas ponto - determinar se é decimal ou milhares
      const parts = cleaned.split('.');
      if (parts.length === 2 && parts[1].length <= 2 && parts[0].length <= 3) {
        // Ponto como decimal: 123.45 -> 123.45
        // Não fazer nada, já está correto
      } else {
        // Ponto como milhares: 1.500 ou 45.000 -> 1500 ou 45000
        cleaned = cleaned.replace(/\./g, '');
      }
    }
    
    const amount = parseFloat(cleaned) || 0;
    return hasK ? amount * 1000 : amount;
  }

  extractIncome(message) {
    const incomePatterns = [
      /(?:salário|vencimento|ordenado|ganho|recebo|auferido|rendimento|remuneração).*?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€).*?(?:salário|vencimento|ordenado|por mês|mensal|anual)/gi,
      /(?:salário|vencimento|ordenado|ganho|recebo).*?(\d+(?:[.,]\d+)?)k/gi,
      /(?:ganho|recebo|aufiro).*?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi
    ];

    for (const pattern of incomePatterns) {
      const matches = [...message.matchAll(pattern)];
      if (matches.length > 0) {
        let amount = this.parseAmount(matches[0][1]);
        
        // Detectar multiplicadores na frase original
        const originalMatch = matches[0][0];
        
        if (originalMatch.includes('mil') || message.includes('mil')) {
          amount = amount * 1000;
        }
        
        if (originalMatch.includes('k') || message.includes('k')) {
          amount = amount * 1000;
        }
        
        if (amount > 0) {
          if (message.includes('mês') || message.includes('mensal') || message.includes('mensais')) {
            return amount * 12;
          } else {
            return amount;
          }
        }
      }
    }
    return 0;
  }

  extractDependents(message) {
    const dependentsPatterns = [
      // Padrões diretos com números
      /tenho\s*(\d+)\s*(?:filhos?|dependentes?|crianças?)/gi,
      /(?:sou pai|sou mãe).*?(\d+)\s*filhos?/gi,
      /(\d+)\s*(?:filhos?|dependentes?|crianças?)/gi,
      
      // Padrões com números por extenso
      /tenho\s*(um|uma|dois|duas|três|quatro|cinco|seis)\s*(?:filhos?|dependentes?|crianças?)/gi,
      /(?:sou pai|sou mãe).*?(um|uma|dois|duas|três|quatro|cinco)\s*filhos?/gi,
      /(?:sou pai|sou mãe).*?(duas?|três|quatro|cinco)\s*(?:filhos?|crianças?)/gi,
      
      // Padrões de negação
      /(?:não tenho|sem)\s*(?:filhos?|dependentes?|crianças?)/gi,
      /(?:zero|nenhum|nenhuma)\s*(?:filhos?|dependentes?|crianças?)/gi
    ];

    for (const pattern of dependentsPatterns) {
      const matches = [...message.matchAll(pattern)];
      if (matches.length > 0) {
        const numberStr = matches[0][1];
        
        // Se é negação, retornar 0
        if (!numberStr || /não|sem|zero|nenhum|nenhuma/.test(matches[0][0])) {
          return 0;
        }
        
        let count = 0;
        
        const numberMap = {
          'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 
          'quatro': 4, 'cinco': 5, 'seis': 6
        };
        
        if (numberMap[numberStr]) {
          count = numberMap[numberStr];
        } else if (!isNaN(parseInt(numberStr))) {
          count = parseInt(numberStr);
        }
        
        return count;
      }
    }
    return null;
  }

  extractCivilStatus(message) {
    const civilStatusPatterns = [
      { pattern: /(?:sou|estou)\s*(?:solteiro|solteira)/gi, status: 'single' },
      { pattern: /(?:sou|estou)\s*(?:casado|casada)/gi, status: 'married' },
      { pattern: /(?:sou|estou)\s*(?:divorciado|divorciada)/gi, status: 'divorced' },
      { pattern: /(?:tenho|minha?)\s*(?:esposa|marido|cônjuge)/gi, status: 'married' },
      { pattern: /(?:união de facto|vivo junto|companheiro|companheira)/gi, status: 'married' },
      { pattern: /(?:não tenho|sem)\s*(?:esposa|marido|cônjuge)/gi, status: 'single' },
      { pattern: /(?:pessoa|vida)\s*solteira/gi, status: 'single' }
    ];

    for (const item of civilStatusPatterns) {
      if (item.pattern.test(message)) {
        return item.status;
      }
    }
    return null;
  }
}

// Executar testes
console.log('=== TESTE DE MELHORIAS DA IA ===\n');

const ai = new TestAI();

// Teste 1: Reconhecimento monetário
console.log('1. TESTE MONETÁRIO:');
const monetaryTests = [
  'Ganho 1.500 euros por mês',
  'O meu salário é 30k',
  'Recebo 2,5 mil euros mensais',
  'Tenho um vencimento de 45.000€ anuais',
  'O meu ordenado é de 1.200€ mensais'
];

monetaryTests.forEach((test, i) => {
  const income = ai.extractIncome(test);
  console.log(`Teste ${i+1}: '${test}'`);
  console.log(`Rendimento extraído: ${income}€`);
  console.log('---');
});

// Teste 2: Reconhecimento de dependentes
console.log('\n2. TESTE DE DEPENDENTES:');
const dependentsTests = [
  'Tenho 2 filhos',
  'Sou pai de três crianças',
  'Tenho uma filha',
  'Não tenho filhos',
  'Sou mãe de dois filhos'
];

dependentsTests.forEach((test, i) => {
  const deps = ai.extractDependents(test);
  console.log(`Teste ${i+1}: '${test}'`);
  console.log(`Dependentes: ${deps}`);
  console.log('---');
});

// Teste 3: Estado civil
console.log('\n3. TESTE DE ESTADO CIVIL:');
const civilTests = [
  'Sou casado',
  'Estou solteira',
  'Tenho esposa',
  'Vivo junto com o meu companheiro',
  'Sou divorciada'
];

civilTests.forEach((test, i) => {
  const status = ai.extractCivilStatus(test);
  console.log(`Teste ${i+1}: '${test}'`);
  console.log(`Estado civil: ${status}`);
  console.log('---');
});

// Teste 4: Casos complexos
console.log('\n4. TESTE DE CASOS COMPLEXOS:');
const complexTests = [
  'Sou casado, tenho 2 filhos e ganho 2.500€ por mês',
  'Estou divorciada, tenho uma filha e o meu salário é 35k anuais',
  'Não tenho filhos, sou solteiro e recebo 1.800 euros mensais'
];

complexTests.forEach((test, i) => {
  const income = ai.extractIncome(test);
  const deps = ai.extractDependents(test);
  const civil = ai.extractCivilStatus(test);
  
  console.log(`Teste ${i+1}: '${test}'`);
  console.log(`Rendimento: ${income}€, Dependentes: ${deps}, Estado civil: ${civil}`);
  console.log('---');
});

console.log('\n=== TESTES CONCLUÍDOS ===');