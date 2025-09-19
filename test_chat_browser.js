// Browser automation test for robust chat UI
const puppeteer = require('puppeteer');

async function testChatUIInBrowser() {
    console.log('🧪 TESTE CHAT UI ROBUSTO - NAVEGADOR');
    console.log('=====================================\n');
    
    let browser;
    let passed = 0;
    let failed = 0;
    
    try {
        browser = await puppeteer.launch({ 
            headless: false, // Para debug visual
            defaultViewport: { width: 1280, height: 720 }
        });
        
        const page = await browser.newPage();
        
        // Navegar para a página da calculadora
        console.log('📡 Navegando para http://localhost:3000/calculadora-ia');
        await page.goto('http://localhost:3000/calculadora-ia', { 
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        
        // Aguardar o chat carregar
        await page.waitForSelector('[data-testid="chat-container"], .chat-container, input[placeholder*="situação fiscal"]', { timeout: 10000 });
        
        console.log('✅ Chat UI carregado com sucesso\n');
        
        const testMessages = [
            "Sou motorista e ganho 25000 euros por ano",
            "Trabalho como enfermeira, ganho 30000 anuais", 
            "Sou professor, recebo 28000 por ano",
            "Ganho 15000 euros por ano",
            "Sou casado e ganho 40000"
        ];
        
        for (let i = 0; i < testMessages.length; i++) {
            const message = testMessages[i];
            console.log(`📝 Teste ${i + 1}/${testMessages.length}: "${message}"`);
            
            try {
                // Localizar campo de input (múltiplos seletores para robustez)
                const inputSelector = 'input[placeholder*="situação"], input[placeholder*="fiscal"], input[type="text"]';
                await page.waitForSelector(inputSelector, { timeout: 5000 });
                
                // Limpar e digitar mensagem
                await page.click(inputSelector);
                await page.keyboard.selectAll();
                await page.type(inputSelector, message);
                
                // Pressionar Enter ou clicar em enviar
                await Promise.race([
                    page.keyboard.press('Enter'),
                    page.click('button[type="submit"], button:has-text("Enviar"), button:has-text("Send")')
                ]);
                
                // Aguardar resposta da IA (múltiplos indicadores)
                await page.waitForFunction(
                    () => {
                        const messages = document.querySelectorAll('[data-role="assistant"], .message-assistant, .bg-gray-100');
                        return messages.length > 0;
                    },
                    { timeout: 15000 }
                );
                
                // Verificar se há resposta válida
                const lastResponse = await page.evaluate(() => {
                    const messages = document.querySelectorAll('[data-role="assistant"], .message-assistant, .bg-gray-100');
                    const lastMessage = messages[messages.length - 1];
                    return lastMessage ? lastMessage.textContent.trim() : '';
                });
                
                if (lastResponse && lastResponse.length > 10 && !lastResponse.includes('erro')) {
                    console.log(`✅ SUCESSO: ${lastResponse.substring(0, 60)}...`);
                    passed++;
                } else {
                    throw new Error('Resposta inválida ou erro');
                }
                
                // Pequena pausa entre testes
                await page.waitForTimeout(2000);
                
            } catch (error) {
                console.log(`❌ ERRO: ${error.message}`);
                failed++;
                
                // Tentar resetar o chat se possível
                try {
                    await page.click('button:has-text("Limpar"), button:has-text("Clear"), button:has-text("Reset")');
                    await page.waitForTimeout(1000);
                } catch (resetError) {
                    // Ignorar se não conseguir resetar
                }
            }
        }
        
    } catch (error) {
        console.log(`❌ ERRO CRÍTICO: ${error.message}`);
        failed = testMessages?.length || 5;
        
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    console.log('\n========================================');
    console.log(`📊 RESULTADO: ${passed}/${passed + failed} SUCESSOS`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 TODOS OS TESTES PASSARAM - CHAT UI ROBUSTO!');
    } else {
        console.log(`\n⚠️  ${failed} teste(s) falharam - verificar implementação.`);
    }
    
    return { passed, failed, total: passed + failed };
}

// Verificar se puppeteer está disponível
try {
    testChatUIInBrowser().catch(console.error);
} catch (error) {
    console.log('❌ Erro: puppeteer não encontrado. Instale com: npm install puppeteer');
    console.log('\n🔄 Executando teste manual alternativo...\n');
    
    // Teste manual alternativo
    console.log('🧪 TESTE MANUAL - CHAT UI');
    console.log('=========================');
    console.log('');
    console.log('Para testar o chat UI robusto:');
    console.log('1. Abra http://localhost:3000/calculadora-ia');
    console.log('2. Digite: "Sou motorista e ganho 25000 euros por ano"');
    console.log('3. Pressione Enter');
    console.log('4. Verifique se a resposta é válida e sem erros');
    console.log('5. Teste cenários adicionais como casado, filhos, etc.');
    console.log('');
    console.log('✅ Indicadores de sucesso:');
    console.log('   - Chat responde sem crashes');
    console.log('   - Mensagens são formatadas corretamente');
    console.log('   - Dados são extraídos (seção verde)');
    console.log('   - Insights inteligentes aparecem (seção roxa)');
    console.log('   - Botão retry funciona em caso de erro');
    console.log('');
}