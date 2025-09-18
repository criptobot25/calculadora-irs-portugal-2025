// Simple robustness test using built-in fetch
async function testAIRobustness() {
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
    
    console.log('🧪 TESTE DE ROBUSTEZ DA IA');
    console.log('==========================\n');
    
    let passed = 0;
    let failed = 0;
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        console.log(`📝 Teste ${i + 1}/${testScenarios.length}: "${scenario}"`);
        
        try {
            const response = await fetch('http://localhost:3000/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: scenario })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Validate response
            if (!data.message || typeof data.message !== 'string') {
                throw new Error('Mensagem inválida');
            }
            
            if (typeof data.confidence !== 'number') {
                throw new Error('Confiança inválida');
            }
            
            // Check insights duplication
            const msg = data.message.toLowerCase();
            const hasInsightsInMsg = msg.includes('insights inteligentes') || 
                                   msg.includes('💡') || 
                                   msg.includes('📊') || 
                                   msg.includes('🎯');
            
            const hasMLInsights = data.mlInsights && data.mlInsights.length > 0;
            
            if (hasInsightsInMsg && hasMLInsights) {
                console.log('⚠️  DUPLICAÇÃO DE INSIGHTS DETECTADA!');
            }
            
            passed++;
            console.log(`✅ OK (confiança: ${data.confidence}, insights: ${hasMLInsights ? data.mlInsights.length : 0})`);
            
        } catch (error) {
            failed++;
            console.log(`❌ ERRO: ${error.message}`);
        }
        
        // Delay between tests
        await new Promise(r => setTimeout(r, 200));
    }
    
    console.log('\n' + '='.repeat(40));
    console.log(`📊 RESULTADO: ${passed}/${testScenarios.length} SUCESSOS`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 TODOS OS TESTES PASSARAM!');
        console.log('✨ A IA está robusta e sem erros.');
    } else {
        console.log(`\n⚠️  ${failed} teste(s) falharam - correção necessária.`);
    }
    
    return failed === 0;
}

// Auto-run when script is executed
testAIRobustness().catch(console.error);