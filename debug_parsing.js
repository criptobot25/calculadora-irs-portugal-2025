// Debug do parsing monetário

function debugParseAmount(str) {
  console.log(`Entrada: "${str}"`);
  
  if (!str) return 0;
  
  // Remover espaços e manter apenas números, vírgulas e pontos
  let cleaned = str.replace(/[^\d,.]/g, '').trim();
  console.log(`Limpo: "${cleaned}"`);
  
  const hasK = /\d+k/i.test(str);
  console.log(`Tem K: ${hasK}`);
  
  // Tratar diferentes formatos monetários
  if (cleaned.includes(',') && cleaned.includes('.')) {
    console.log('Tem vírgula e ponto');
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      console.log('Vírgula é decimal (formato PT)');
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      console.log('Ponto é decimal (formato EN)');
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    console.log('Só tem vírgula');
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      console.log('Vírgula como decimal');
      cleaned = cleaned.replace(',', '.');
    } else {
      console.log('Vírgula como milhares');
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes('.')) {
    console.log('Só tem ponto');
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length <= 2 && parts[0].length <= 3) {
      console.log('Ponto como decimal');
      // Não fazer nada, já está correto
    } else {
      console.log('Ponto como milhares');
      cleaned = cleaned.replace(/\./g, '');
    }
  }
  
  console.log(`Final limpo: "${cleaned}"`);
  const amount = parseFloat(cleaned) || 0;
  console.log(`Amount: ${amount}`);
  
  const result = hasK ? amount * 1000 : amount;
  console.log(`Resultado: ${result}`);
  console.log('---');
  
  return result;
}

console.log('=== DEBUG PARSING ===');

// Testar problemas específicos
debugParseAmount('1.500');  // Deveria ser 1500
debugParseAmount('2,5');    // Deveria ser 2.5
debugParseAmount('45.000'); // Deveria ser 45000
debugParseAmount('1.200');  // Deveria ser 1200

console.log('\n=== REGEX DEBUG ===');

function testRegex() {
  const tests = [
    'Ganho 1.500 euros por mês',
    'O meu salário é 30k',
    'Recebo 2,5 mil euros mensais',
    'Tenho um vencimento de 45.000€ anuais',
    'O meu ordenado é de 1.200€ mensais'
  ];
  
  const patterns = [
    /(?:salário|vencimento|ordenado|ganho|recebo|auferido|rendimento|remuneração)\s+(?:de\s+|é\s+|:?\s*)?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
    /(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€).*?(?:salário|vencimento|ordenado|por mês|mensal|anual)/gi,
    /(?:salário|vencimento|ordenado|ganho|recebo)\s+(?:de\s+|é\s+|:?\s*)?(\d+(?:[.,]\d+)?)k/gi,
    /(?:ganho|recebo|aufiro)\s+(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi,
    /(?:o\s+meu\s+|meu\s+)?(?:salário|vencimento|ordenado)\s+(?:é\s+)?(?:de\s+)?(\d+(?:[.,]\d+)?)\s*(?:mil\s*)?(?:euros?|€)/gi
  ];
  
  tests.forEach((test, i) => {
    console.log(`\nTeste ${i+1}: "${test}"`);
    
    patterns.forEach((pattern, j) => {
      const matches = [...test.matchAll(pattern)];
      if (matches.length > 0) {
        console.log(`  Padrão ${j+1} match: "${matches[0][0]}" -> "${matches[0][1]}"`);
      }
    });
  });
}

testRegex();