// Simple test script to validate AI responses manually
const testScenarios = [
    // Basic profession scenarios
    "Sou motorista e ganho 25000 euros por ano",
    "Trabalho como enfermeira, ganho 30000 anuais", 
    "Sou professor, recebo 28000 por ano",
    "Trabalho na construção civil, ganho 22000",
    "Sou contabilista e ganho 35000 euros",
    
    // Different income levels
    "Ganho 15000 euros por ano",
    "O meu salário é de 45000 euros anuais",
    "Recebo 80000 euros por ano",
    "Ganho 120000 euros anuais",
    
    // Civil status scenarios
    "Sou casado e ganho 40000",
    "Sou solteiro, ganho 35000",
    "Divorciado, ganho 42000 por ano",
    
    // Dependents scenarios
    "Tenho 2 filhos e ganho 38000",
    "Sou mãe solteira com 1 filho, ganho 28000",
    "Casal com 3 filhos, ganhamos 60000",
    
    // Complex scenarios
    "Sou freelancer, ganho cerca de 45000, tenho 1 filho",
    "Trabalho por conta própria, ganho 55000, sou casado",
    "Tenho trabalho independente, 35000 anuais, 2 dependentes",
    
    // Edge cases
    "Quanto pago de IRS?",
    "Preciso calcular impostos",
    "Ajuda com declaração IRS",
    "Como reduzir IRS?",
    "Que deduções posso ter?",
    
    // Empty/minimal input
    "Olá",
    "Bom dia",
    "Preciso de ajuda",
    
    // Mixed language/typos
    "Sou teacher, ganho 30k",
    "Trabalho como driver, 25mil por ano",
    "ganho 40k sou married",
];

console.log('🧪 CENÁRIOS DE TESTE PARA VALIDAÇÃO MANUAL');
console.log('=========================================');
console.log(`Total de cenários: ${testScenarios.length}\n`);

console.log('📝 LISTA DE CENÁRIOS:');
testScenarios.forEach((scenario, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${scenario}`);
});

console.log('\n✅ CRITÉRIOS DE VALIDAÇÃO:');
console.log('1. A IA deve responder a todos os cenários sem erros');
console.log('2. Insights devem aparecer APENAS na seção "Insights Inteligentes"');
console.log('3. NÃO deve haver duplicação de insights na mensagem principal');
console.log('4. Dados devem ser extraídos corretamente quando possível');
console.log('5. Resposta deve ser contextual e útil');
console.log('6. Tempo de resposta deve ser razoável (<5 segundos)');

console.log('\n🔍 COMO TESTAR:');
console.log('1. Abra o navegador em http://localhost:3000/calculadora-ia');
console.log('2. Digite cada cenário no chat da IA');
console.log('3. Verifique se:');
console.log('   - Não há erros no console do navegador');
console.log('   - A resposta é relevante');
console.log('   - Insights aparecem na seção dedicada');
console.log('   - Dados são extraídos quando aplicável');
console.log('   - Não há duplicação de conteúdo');

console.log('\n⚠️  PROBLEMAS COMUNS A VERIFICAR:');
console.log('- "Cannot read property" errors');
console.log('- Insights duplicados na mensagem');
console.log('- Resposta vazia ou "undefined"');
console.log('- Timeout ou demora excessiva');
console.log('- Extração de dados incorreta');