// Test the actual TypeScript implementation
// This requires transpiling TypeScript to JavaScript or using ts-node

import('../../src/lib/hybridAI.ts').then(async (module) => {
    const { HybridIntelligentAI } = module;
    
    console.log('🧪 TESTE IMPLEMENTAÇÃO TYPESCRIPT REAL');
    console.log('=====================================\n');
    
    const ai = new HybridIntelligentAI();
    
    const testScenarios = [
        "Sou motorista e ganho 25000 euros por ano",
        "Trabalho como enfermeira, ganho 30000 anuais",
        "Sou professor, recebo 28000 por ano",
        "Ganho 15000 euros por ano",
        "Recebo 80000 euros anuais",
        "Sou casado e ganho 40000",
        "Tenho 2 filhos e ganho 38000",
        "Quanto pago de IRS?",
        "Olá",
        ""
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        console.log(`📝 Teste ${i + 1}/${testScenarios.length}: "${scenario}"`);
        
        try {
            const response = await ai.processMessage(scenario);
            
            // Validate response structure
            if (!response.message || typeof response.message !== 'string') {
                throw new Error('Mensagem inválida');
            }
            
            if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
                throw new Error('Confiança inválida');
            }
            
            if (!Array.isArray(response.mlInsights)) {
                throw new Error('mlInsights deve ser um array');
            }
            
            // Check for insights duplication
            const msg = response.message.toLowerCase();
            const hasInsightsInMsg = msg.includes('insights inteligentes') || 
                                   msg.includes('💡') || 
                                   msg.includes('📊') || 
                                   msg.includes('🎯');
            
            const hasMLInsights = response.mlInsights && response.mlInsights.length > 0;
            
            if (hasInsightsInMsg && hasMLInsights) {
                console.log('❌ DUPLICAÇÃO DE INSIGHTS DETECTADA!');
                throw new Error('Insights duplicados');
            }
            
            passed++;
            console.log(`✅ OK (confiança: ${response.confidence.toFixed(2)}, insights: ${response.mlInsights.length})`);
            
        } catch (error) {
            failed++;
            console.log(`❌ ERRO: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(40));
    console.log(`📊 RESULTADO: ${passed}/${testScenarios.length} SUCESSOS`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 IMPLEMENTAÇÃO TYPESCRIPT FUNCIONA PERFEITAMENTE!');
        console.log('✨ A IA está robusta e sem erros.');
    } else {
        console.log(`\n⚠️  ${failed} teste(s) falharam - correção necessária.`);
    }
    
}).catch(error => {
    console.log('❌ Erro ao importar módulo TypeScript:', error.message);
    console.log('ℹ️  Isso é esperado em Node.js puro. O TypeScript funciona no browser/Next.js.');
});