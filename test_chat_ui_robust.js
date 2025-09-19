// Test the client-side AI chat implementation directly
const { HybridIntelligentAI } = require('./src/lib/hybridAI.ts');

async function testClientSideAI() {
    const testScenarios = [
        // Basic profession scenarios
        "Sou motorista e ganho 25000 euros por ano",
        "Trabalho como enfermeira, ganho 30000 anuais",
        "Sou professor, recebo 28000 por ano",
        
        // Income variations
        "Ganho 15000 euros por ano",
        "Recebo 80000 euros anuais",
        "Ganho 120000 euros por ano",
        
        // Civil status
        "Sou casado e ganho 40000",
        "Sou solteiro, ganho 35000",
        
        // Dependents
        "Tenho 2 filhos e ganho 38000",
        "Sou mãe solteira com 1 filho, ganho 28000",
        
        // Edge cases
        "Quanto pago de IRS?",
        "Olá",
        "Preciso de ajuda",
        "",  // Empty string
        "ganho 40k sou married",
    ];
    
    console.log('🧪 TESTE ROBUSTEZ - CHAT UI CLIENTE');
    console.log('====================================\n');
    
    let passed = 0;
    let failed = 0;
    const ai = new HybridIntelligentAI();
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        console.log(`📝 Teste ${i + 1}/${testScenarios.length}: "${scenario}"`);
        
        try {
            const response = await ai.processMessage(scenario);
            
            // Validate response structure
            if (!response || typeof response.message !== 'string') {
                throw new Error('Resposta inválida');
            }
            
            if (response.message.length === 0) {
                throw new Error('Mensagem vazia');
            }
            
            // Check for basic response quality
            if (response.message.includes('erro') || response.message.includes('Error')) {
                throw new Error('Resposta contém erro');
            }
            
            console.log(`✅ SUCESSO: ${response.message.substring(0, 50)}...`);
            console.log(`   📊 Confiança: ${response.confidence || 'N/A'}`);
            console.log(`   🔍 Dados extraídos: ${Object.keys(response.extractedData || {}).length} campos`);
            console.log(`   💡 Insights: ${(response.mlInsights || []).length} insights\n`);
            
            passed++;
            
        } catch (error) {
            console.log(`❌ ERRO: ${error.message}`);
            failed++;
        }
    }
    
    console.log('========================================');
    console.log(`📊 RESULTADO: ${passed}/${testScenarios.length} SUCESSOS`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 TODOS OS TESTES PASSARAM - CHAT UI ROBUSTO!');
    } else {
        console.log(`\n⚠️  ${failed} teste(s) falharam - correção necessária.`);
    }
    
    return { passed, failed, total: testScenarios.length };
}

// Run tests
testClientSideAI().catch(console.error);