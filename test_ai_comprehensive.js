// Comprehensive AI Chat Testing Script
import { HybridIntelligentAI } from './src/lib/hybridAI.js';

// Test scenarios covering all possible edge cases
const testScenarios = [
    // Basic profession scenarios
    "Sou motorista e ganho 25000 euros por ano",
    "Trabalho como enfermeira, ganho 30000 anuais", 
    "Sou professor, recebo 28000 por ano",
    "Trabalho na construção civil, ganho 22000",
    "Sou contabilista e ganho 35000 euros",
    "Sou médico e ganho 65000",
    "Trabalho como advogado, 70000 anuais",
    "Sou engenheiro, ganho 50000",
    "Trabalho em IT, recebo 55000",
    "Sou farmacêutico, 45000 por ano",
    
    // Different income levels (testing all tax brackets)
    "Ganho 7000 euros por ano",           // Very low income
    "Recebo 15000 euros anuais",          // Low income  
    "O meu salário é de 25000 euros",     // Medium-low
    "Ganho 45000 euros por ano",          // Medium
    "Recebo 80000 euros anuais",          // High
    "Ganho 120000 euros por ano",         // Very high
    "Recebo 200000 euros anuais",         // Maximum bracket
    
    // Civil status scenarios
    "Sou casado e ganho 40000",
    "Sou solteiro, ganho 35000", 
    "Divorciado, ganho 42000 por ano",
    "Sou viúvo e ganho 38000",
    "União de facto, ganho 33000",
    
    // Dependents scenarios
    "Tenho 1 filho e ganho 35000",
    "Tenho 2 filhos e ganho 38000",
    "Tenho 3 filhos e ganho 45000",
    "Sou mãe solteira com 1 filho, ganho 28000",
    "Casal com 4 filhos, ganhamos 60000",
    "Tenho filhos mas não especifico quantos, ganho 40000",
    
    // Complex scenarios
    "Sou freelancer, ganho cerca de 45000, tenho 1 filho",
    "Trabalho por conta própria, ganho 55000, sou casado",
    "Tenho trabalho independente, 35000 anuais, 2 dependentes",
    "Sou pensionista, recebo 18000 por ano",
    "Tenho rendimentos de capitais, 25000 anuais",
    "Trabalho part-time, ganho 12000, sou estudante",
    
    // Edge cases - minimal information
    "Quanto pago de IRS?",
    "Preciso calcular impostos",
    "Ajuda com declaração IRS", 
    "Como reduzir IRS?",
    "Que deduções posso ter?",
    "Qual é a taxa de IRS?",
    "Quando entregar declaração?",
    
    // Edge cases - greeting/minimal input
    "Olá",
    "Bom dia",
    "Preciso de ajuda",
    "Oi",
    "Como estás?",
    "",  // Empty string
    "   ",  // Only spaces
    
    // Mixed language/typos/informal
    "Sou teacher, ganho 30k",
    "Trabalho como driver, 25mil por ano", 
    "ganho 40k sou married",
    "trabalho nurse 30000€",
    "sou enginer, 50mil",
    "work in IT, ganho 55k",
    
    // Numbers in different formats
    "Ganho 35.000 euros",
    "Recebo 45,000 por ano",
    "Salário de €50000",
    "Ganho 30k anuais",
    "Recebo 25 mil euros",
    "Salário: 40000€",
    
    // Deduction-related scenarios
    "Tenho despesas médicas de 2000 euros, ganho 40000",
    "Pago crédito habitação, ganho 50000",
    "Tenho filhos na escola, ganho 35000",
    "Faço donativos, ganho 45000",
    "Tenho PPR, ganho 60000",
    
    // Complex mixed scenarios
    "Sou casado, 2 filhos, ganho 45000, tenho crédito habitação",
    "Trabalho por conta própria, solteiro, 38000, sem dependentes",
    "Enfermeira, casada, 1 filho, 32000, despesas médicas altas",
    "Professor universitário, divorciado, 2 filhos, 48000",
    
    // Potential problematic inputs
    "Ganho muito dinheiro",
    "Não ganho nada",
    "Salário variável",
    "Depende do mês",
    "Às vezes ganho mais às vezes menos",
    "Trabalho esporadicamente",
    
    // Special characters and encoding
    "Ganho 30000€ ànnuais",
    "Sou médico, 65000€/año",
    "Trabalho + freelance = 50000",
    "Salário base: 35000 + bonus",
];

async function runComprehensiveTests() {
    console.log('🚀 Iniciando testes abrangentes do chat AI...\n');
    
    const ai = new HybridIntelligentAI();
    let totalTests = 0;
    let successfulTests = 0;
    let failedTests = 0;
    const failures = [];
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        totalTests++;
        
        console.log(`\n📝 Teste ${i + 1}/${testScenarios.length}: "${scenario}"`);
        
        try {
            const startTime = Date.now();
            const response = await ai.processMessage(scenario);
            const duration = Date.now() - startTime;
            
            // Validate response structure
            if (!response || typeof response !== 'object') {
                throw new Error('Response is not an object');
            }
            
            if (!response.message || typeof response.message !== 'string') {
                throw new Error('Response.message is missing or not a string');
            }
            
            if (response.confidence === undefined || typeof response.confidence !== 'number') {
                throw new Error('Response.confidence is missing or not a number');
            }
            
            if (!response.extractedData || typeof response.extractedData !== 'object') {
                throw new Error('Response.extractedData is missing or not an object');
            }
            
            if (response.mlInsights && !Array.isArray(response.mlInsights)) {
                throw new Error('Response.mlInsights is not an array');
            }
            
            // Check for insights duplication in message
            const messageContent = response.message.toLowerCase();
            const hasInsightsInMessage = messageContent.includes('insights inteligentes') || 
                                       messageContent.includes('💡') ||
                                       messageContent.includes('📊') ||
                                       messageContent.includes('🎯');
            
            if (hasInsightsInMessage && response.mlInsights && response.mlInsights.length > 0) {
                console.log('⚠️  AVISO: Possível duplicação de insights detectada');
            }
            
            successfulTests++;
            console.log(`✅ Sucesso (${duration}ms)`);
            console.log(`   Confiança: ${response.confidence}`);
            console.log(`   Dados extraídos: ${Object.keys(response.extractedData).length} campos`);
            console.log(`   Insights: ${response.mlInsights ? response.mlInsights.length : 0}`);
            console.log(`   Tamanho da resposta: ${response.message.length} chars`);
            
        } catch (error) {
            failedTests++;
            failures.push({
                scenario,
                error: error.message,
                index: i + 1
            });
            console.log(`❌ Falha: ${error.message}`);
        }
    }
    
    // Results summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DOS TESTES');
    console.log('='.repeat(60));
    console.log(`Total de testes: ${totalTests}`);
    console.log(`Sucessos: ${successfulTests} (${(successfulTests/totalTests*100).toFixed(1)}%)`);
    console.log(`Falhas: ${failedTests} (${(failedTests/totalTests*100).toFixed(1)}%)`);
    
    if (failures.length > 0) {
        console.log('\n❌ FALHAS DETALHADAS:');
        failures.forEach(failure => {
            console.log(`\n${failure.index}. "${failure.scenario}"`);
            console.log(`   Erro: ${failure.error}`);
        });
    }
    
    if (failedTests === 0) {
        console.log('\n🎉 TODOS OS TESTES PASSARAM! Chat AI está robusto.');
    } else {
        console.log(`\n⚠️  ${failedTests} teste(s) falharam. Necessária correção.`);
    }
    
    return {
        total: totalTests,
        successful: successfulTests,
        failed: failedTests,
        failures
    };
}

// Run if called directly
runComprehensiveTests()
    .then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
        console.error('💥 Erro crítico nos testes:', error);
        process.exit(1);
    });

export { runComprehensiveTests, testScenarios };