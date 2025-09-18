// Automated test to validate AI chat robustness
const fetch = require('node-fetch');

async function testAIEndpoint() {
    const baseURL = 'http://localhost:3000';
    
    const testScenarios = [
        // Critical scenarios that previously failed
        "Sou motorista e ganho 25000 euros por ano",
        "Trabalho como enfermeira, ganho 30000 anuais",
        "Sou professor, recebo 28000 por ano",
        "Quanto pago de IRS?",
        "Olá",
        "",  // Empty string
        "ganho 40k sou married",
        "Sou freelancer, ganho cerca de 45000, tenho 1 filho",
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('🧪 Testando API da IA...\n');
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        console.log(`📝 Teste ${i + 1}: "${scenario}"`);
        
        try {
            const response = await fetch(`${baseURL}/api/ai-assistant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: scenario })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Validate response structure
            if (!data.message) {
                throw new Error('Resposta não contém mensagem');
            }
            
            if (typeof data.confidence !== 'number') {
                throw new Error('Confiança inválida');
            }
            
            if (!data.extractedData || typeof data.extractedData !== 'object') {
                throw new Error('Dados extraídos inválidos');
            }
            
            // Check for insights duplication
            const messageContent = data.message.toLowerCase();
            const hasInsights = data.mlInsights && data.mlInsights.length > 0;
            const hasInsightsInMessage = messageContent.includes('insights inteligentes') || 
                                       messageContent.includes('💡') ||
                                       messageContent.includes('📊') ||
                                       messageContent.includes('🎯');
            
            if (hasInsightsInMessage && hasInsights) {
                console.log('⚠️  AVISO: Possível duplicação de insights detectada!');
            }
            
            passedTests++;
            console.log(`✅ Sucesso`);
            console.log(`   Confiança: ${data.confidence}`);
            console.log(`   Insights: ${hasInsights ? data.mlInsights.length : 0}`);
            
        } catch (error) {
            failedTests++;
            console.log(`❌ Falha: ${error.message}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 RESULTADO: ${passedTests}/${testScenarios.length} testes passaram`);
    
    if (failedTests === 0) {
        console.log('🎉 Todos os testes passaram! IA está robusta.');
        return true;
    } else {
        console.log(`⚠️  ${failedTests} teste(s) falharam.`);
        return false;
    }
}

// Check if server is running first
async function checkServerStatus() {
    try {
        const response = await fetch('http://localhost:3000');
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🔍 Verificando se servidor está rodando...');
    
    const serverRunning = await checkServerStatus();
    if (!serverRunning) {
        console.log('❌ Servidor não está rodando em http://localhost:3000');
        console.log('💡 Execute: npm run dev');
        process.exit(1);
    }
    
    console.log('✅ Servidor encontrado!\n');
    
    const success = await testAIEndpoint();
    process.exit(success ? 0 : 1);
}

main().catch(error => {
    console.error('💥 Erro crítico:', error);
    process.exit(1);
});