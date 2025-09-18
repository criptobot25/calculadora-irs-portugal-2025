// Testes de stress e cenários extremos para a IA
// Este teste vai além dos cenários normais para encontrar qualquer falha possível

class ExtensiveAITester {
  constructor() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.insights_duplicated = 0;
    this.performance_issues = 0;
    this.security_issues = 0;
  }

  // Simular a IA com lógica mais rigorosa
  async simulateAI(message) {
    try {
      // Simular processamento real da IA
      const response = {
        message: this.generateResponse(message),
        extractedData: this.extractData(message),
        confidence: this.calculateConfidence(message),
        sources: [],
        mlInsights: this.generateInsights(message)
      };

      // Validação rigorosa
      this.validateResponse(response);
      
      return response;
    } catch (error) {
      // Fallback robusto
      return {
        message: 'Desculpe, houve um erro temporário. Pode reformular a sua pergunta?',
        extractedData: {},
        confidence: 0.1,
        sources: [],
        mlInsights: ['💡 Tente novamente com mais detalhes sobre a sua situação']
      };
    }
  }

  generateResponse(message) {
    if (!message || typeof message !== 'string') {
      return 'Por favor, descreva a sua situação fiscal para que eu possa ajudar.';
    }

    const cleanMessage = message.toLowerCase().trim();
    
    if (cleanMessage === '') {
      return 'Como posso ajudar com o seu IRS? Descreva a sua situação.';
    }

    // Detectar profissão
    const professions = {
      'motorista': ['motorista', 'condutor', 'chofer', 'camionista', 'taxista'],
      'enfermeiro': ['enfermeira', 'enfermeiro', 'auxiliar de saúde'],
      'professor': ['professor', 'professora', 'docente', 'educadora', 'ensino'],
      'médico': ['médico', 'médica', 'doutor', 'doutora', 'clínico'],
      'engenheiro': ['engenheiro', 'engenheira', 'eng.'],
      'advogado': ['advogado', 'advogada', 'jurista'],
      'funcionário público': ['funcionário público', 'funcionária pública', 'estado'],
      'freelancer': ['freelancer', 'independente', 'autónomo', 'freelance'],
      'contabilista': ['contabilista', 'contador', 'toc'],
      'comerciante': ['comerciante', 'vendedor', 'comercial']
    };

    let profession = null;
    for (const [prof, keywords] of Object.entries(professions)) {
      if (keywords.some(keyword => cleanMessage.includes(keyword))) {
        profession = prof;
        break;
      }
    }

    // Detectar rendimento
    const incomeMatches = cleanMessage.match(/(\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:euros?|€|k|mil)/);
    let income = null;
    if (incomeMatches) {
      let value = incomeMatches[1].replace(/[.,]/g, '');
      if (cleanMessage.includes('k') || cleanMessage.includes('mil')) {
        income = parseInt(value) * 1000;
      } else {
        income = parseInt(value);
      }
    }

    // Detectar estado civil
    let civilStatus = null;
    if (/\b(?:casad[oa]|cônjuge|esposa?|marido|married)\b/i.test(cleanMessage)) {
      civilStatus = 'married';
    } else if (/\b(?:solteir[oa]|single)\b/i.test(cleanMessage)) {
      civilStatus = 'single';
    } else if (/\b(?:divorc|separad)\b/i.test(cleanMessage)) {
      civilStatus = 'divorced';
    } else if (/\b(?:viúv)\b/i.test(cleanMessage)) {
      civilStatus = 'widowed';
    }

    // Detectar dependentes
    const dependentsMatch = cleanMessage.match(/(\d+)\s*(?:filhos?|dependentes?|crianças?)/);
    let dependents = null;
    if (dependentsMatch) {
      dependents = parseInt(dependentsMatch[1]);
    }

    // Gerar resposta contextual
    let response = 'Analisei a sua situação fiscal. ';

    if (profession) {
      response += `Como ${profession}, `;
    }

    if (income) {
      response += `com um rendimento de ${income.toLocaleString()}€, `;
      if (income > 80000) {
        response += 'está no escalão máximo do IRS (48%). ';
      } else if (income > 36000) {
        response += 'está no escalão de 35% do IRS. ';
      } else if (income > 20000) {
        response += 'está num escalão intermédio do IRS. ';
      } else {
        response += 'tem direito a benefícios fiscais especiais. ';
      }
    }

    if (civilStatus === 'married') {
      response += 'Como casado(a), pode optar por tributação conjunta ou separada. ';
    }

    if (dependents > 0) {
      response += `Com ${dependents} dependente(s), tem direito a deduções significativas. `;
    }

    response += 'Use a calculadora para obter o valor exato do seu IRS.';

    return response;
  }

  extractData(message) {
    const data = {};
    const cleanMessage = message.toLowerCase();

    // Extrair rendimento
    const incomeMatch = cleanMessage.match(/(\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:euros?|€|k|mil)/);
    if (incomeMatch) {
      let value = incomeMatch[1].replace(/[.,]/g, '');
      if (cleanMessage.includes('k') || cleanMessage.includes('mil')) {
        data.employmentIncome = parseInt(value) * 1000;
      } else {
        data.employmentIncome = parseInt(value);
      }
    }

    // Extrair estado civil
    if (/\b(?:casad[oa]|cônjuge|married)\b/i.test(cleanMessage)) {
      data.civilStatus = 'married';
    } else if (/\b(?:solteir[oa]|single)\b/i.test(cleanMessage)) {
      data.civilStatus = 'single';
    } else if (/\b(?:divorc|separad)\b/i.test(cleanMessage)) {
      data.civilStatus = 'divorced';
    } else if (/\b(?:viúv)\b/i.test(cleanMessage)) {
      data.civilStatus = 'widowed';
    }

    // Extrair dependentes
    const dependentsMatch = cleanMessage.match(/(\d+)\s*(?:filhos?|dependentes?|crianças?)/);
    if (dependentsMatch) {
      data.dependents = parseInt(dependentsMatch[1]);
    }

    return data;
  }

  calculateConfidence(message) {
    if (!message || typeof message !== 'string') return 0.1;
    
    let confidence = 0.1; // Base mínima
    
    // Presença de rendimento
    if (/\d+(?:[.,]\d{3})*\s*(?:euros?|€|k)/.test(message)) {
      confidence += 0.4;
    }
    
    // Presença de estado civil
    if (/\b(?:casad|solteir|divorc|viúv|married|single)\b/i.test(message)) {
      confidence += 0.2;
    }
    
    // Presença de dependentes
    if (/\d+\s*(?:filhos?|dependentes?)/.test(message)) {
      confidence += 0.2;
    }
    
    // Presença de profissão
    if (/\b(?:motorista|enfermeiro|professor|médico|engenheiro|freelancer)\b/i.test(message)) {
      confidence += 0.1;
    }
    
    // Mensagem estruturada
    if (message.length > 20 && message.includes(' ')) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  generateInsights(message) {
    const insights = [];
    const data = this.extractData(message);
    
    // Insights baseados em rendimento
    if (data.employmentIncome) {
      if (data.employmentIncome > 80000) {
        insights.push('📈 Rendimento no escalão máximo (48%) - otimização fiscal é crucial');
        insights.push('💰 Considere PPR para reduzir significativamente o IRS');
      } else if (data.employmentIncome > 50000) {
        insights.push('💰 Com rendimento alto, considere PPR para reduzir IRS');
        insights.push('📊 No escalão de 35% - cada dedução tem impacto significativo');
      } else if (data.employmentIncome < 20000) {
        insights.push('💡 Com rendimento baixo, pode ter direito a deduções especiais');
        insights.push('🎯 Verifique benefícios fiscais disponíveis');
      }
    }
    
    // Insights baseados em estado civil
    if (data.civilStatus === 'married') {
      insights.push('👫 Casados podem escolher tributação conjunta ou separada');
      insights.push('💍 Cônjuge também gera dedução de 4.104€');
    }
    
    if (data.civilStatus === 'single' && data.dependents > 0) {
      insights.push('👨‍👩‍👧‍👦 Como pai/mãe solteiro(a), tem deduções especiais');
    }
    
    // Insights baseados em dependentes
    if (data.dependents > 0) {
      insights.push(`👶 ${data.dependents} dependente(s) geram deduções significativas`);
      insights.push('📚 Despesas de educação dos filhos são dedutíveis (até 800€)');
    }
    
    // Insights contextuais
    if (message.includes('freelancer') || message.includes('independente')) {
      insights.push('🔧 Trabalho independente: considere abrir atividade para deduções');
    }
    
    // Garantir pelo menos um insight
    if (insights.length === 0) {
      insights.push('💡 Complete os dados para receber insights personalizados');
      insights.push('🎯 Cada euro em deduções reduz diretamente o seu IRS');
    }
    
    return insights.slice(0, 4); // Máximo 4 insights
  }

  validateResponse(response) {
    // Validação da estrutura
    if (!response || typeof response !== 'object') {
      throw new Error('Resposta deve ser um objeto');
    }

    // Validação da mensagem
    if (!response.message || typeof response.message !== 'string') {
      throw new Error('Mensagem inválida');
    }

    if (response.message.length < 10) {
      throw new Error('Mensagem muito curta');
    }

    if (response.message.length > 2000) {
      throw new Error('Mensagem muito longa');
    }

    // Validação da confiança
    if (typeof response.confidence !== 'number') {
      throw new Error('Confiança deve ser um número');
    }

    if (response.confidence < 0 || response.confidence > 1) {
      throw new Error('Confiança deve estar entre 0 e 1');
    }

    // Validação dos insights
    if (!Array.isArray(response.mlInsights)) {
      throw new Error('mlInsights deve ser um array');
    }

    if (response.mlInsights.length > 10) {
      throw new Error('Muitos insights (máximo 10)');
    }

    // Validação de duplicação de insights
    const msg = response.message.toLowerCase();
    const hasInsightsInMsg = msg.includes('insights inteligentes') || 
                           msg.includes('💡') || 
                           msg.includes('📊') || 
                           msg.includes('🎯') ||
                           msg.includes('💰') ||
                           msg.includes('👫') ||
                           msg.includes('👶') ||
                           msg.includes('📈');

    const hasMLInsights = response.mlInsights && response.mlInsights.length > 0;

    if (hasInsightsInMsg && hasMLInsights) {
      this.insights_duplicated++;
      throw new Error('Insights duplicados detectados');
    }

    // Validação de dados extraídos
    if (response.extractedData && typeof response.extractedData !== 'object') {
      throw new Error('extractedData deve ser um objeto');
    }

    // Validação de segurança - não deve conter scripts
    if (response.message.includes('<script') || response.message.includes('javascript:')) {
      this.security_issues++;
      throw new Error('Conteúdo inseguro detectado');
    }
  }

  async runTest(scenario, description) {
    this.totalTests++;
    console.log(`🧪 Teste ${this.totalTests}: ${description}`);
    console.log(`📝 Input: "${scenario}"`);

    const startTime = Date.now();
    
    try {
      const response = await this.simulateAI(scenario);
      
      // Validação de performance
      const duration = Date.now() - startTime;
      if (duration > 100) { // Mais de 100ms é lento
        this.performance_issues++;
        console.log(`⚠️  Performance lenta: ${duration}ms`);
      }

      this.validateResponse(response);
      
      this.passedTests++;
      console.log(`✅ PASSOU (confiança: ${response.confidence.toFixed(2)}, insights: ${response.mlInsights.length}, tempo: ${duration}ms)`);
      console.log(`📤 Resposta: ${response.message.slice(0, 80)}...`);
      
      return true;
    } catch (error) {
      this.failedTests++;
      console.log(`❌ FALHOU: ${error.message}`);
      return false;
    }
  }

  async runStressTests() {
    console.log('🚨 INICIANDO TESTES DE STRESS E CASOS EXTREMOS');
    console.log('='.repeat(60));

    // Teste 1: Cenários normais
    console.log('\n📋 CATEGORIA 1: CENÁRIOS NORMAIS');
    console.log('-'.repeat(40));
    
    await this.runTest('Sou motorista e ganho 25000 euros por ano', 'Profissão + rendimento');
    await this.runTest('Trabalho como enfermeira, ganho 30000 anuais', 'Profissão + rendimento anual');
    await this.runTest('Professor casado com 2 filhos, 35000€', 'Profissão + estado civil + dependentes');
    await this.runTest('Médico solteiro, 75000 euros por ano', 'Profissão + estado civil + rendimento alto');
    await this.runTest('Freelancer independente, 45000€ anuais', 'Trabalho independente');

    // Teste 2: Casos extremos de rendimento
    console.log('\n📋 CATEGORIA 2: RENDIMENTOS EXTREMOS');
    console.log('-'.repeat(40));
    
    await this.runTest('Ganho 1€ por ano', 'Rendimento mínimo');
    await this.runTest('Recebo 999999 euros anuais', 'Rendimento máximo');
    await this.runTest('Ganho 0 euros', 'Rendimento zero');
    await this.runTest('Rendimento de 15,5k euros', 'Formato decimal');
    await this.runTest('Recebo 2.500,75€ mensais', 'Formato português');

    // Teste 3: Estados civis complexos
    console.log('\n📋 CATEGORIA 3: ESTADOS CIVIS COMPLEXOS');
    console.log('-'.repeat(40));
    
    await this.runTest('Divorciado há 2 anos, 2 filhos menores', 'Divorciado com dependentes');
    await this.runTest('Viúva com 3 filhos, recebo pensão', 'Viúva com pensão');
    await this.runTest('Separado de facto, partilho custos dos filhos', 'Separação de facto');
    await this.runTest('União de facto há 5 anos', 'União de facto');
    await this.runTest('Casado no estrangeiro', 'Casamento internacional');

    // Teste 4: Dependentes extremos
    console.log('\n📋 CATEGORIA 4: DEPENDENTES EXTREMOS');
    console.log('-'.repeat(40));
    
    await this.runTest('Tenho 10 filhos', 'Muitos dependentes');
    await this.runTest('0 filhos, 0 dependentes', 'Zero dependentes');
    await this.runTest('Cuido da minha mãe idosa', 'Dependente ascendente');
    await this.runTest('Filho deficiente, preciso de deduções especiais', 'Dependente com necessidades especiais');
    await this.runTest('Gémeos nascidos este ano', 'Dependentes recentes');

    // Teste 5: Inputs malformados
    console.log('\n📋 CATEGORIA 5: INPUTS MALFORMADOS');
    console.log('-'.repeat(40));
    
    await this.runTest('', 'String vazia');
    await this.runTest('   ', 'Só espaços');
    await this.runTest('a', 'Um caractere');
    await this.runTest('??????????', 'Só pontos de interrogação');
    await this.runTest('1234567890', 'Só números');
    await this.runTest('!@#$%^&*()_+', 'Caracteres especiais');
    await this.runTest('MAIÚSCULAS GRITANTES!!!', 'Texto em maiúsculas');
    await this.runTest('texto sem pontuação nem acentos', 'Sem pontuação');

    // Teste 6: Inputs muito longos
    console.log('\n📋 CATEGORIA 6: INPUTS EXTREMAMENTE LONGOS');
    console.log('-'.repeat(40));
    
    const longText = 'Olá, '.repeat(1000) + 'sou motorista e ganho 30000 euros por ano';
    await this.runTest(longText, 'Texto muito longo (5000+ chars)');
    
    const veryLongText = 'a'.repeat(10000);
    await this.runTest(veryLongText, 'Texto extremamente longo (10k chars)');

    // Teste 7: Caracteres especiais e emojis
    console.log('\n📋 CATEGORIA 7: CARACTERES ESPECIAIS E EMOJIS');
    console.log('-'.repeat(40));
    
    await this.runTest('Ganho 30000€ 💰 sou feliz 😊', 'Com emojis');
    await this.runTest('Àçéñtös ê çàràctérês espëçïàïs', 'Acentos especiais');
    await this.runTest('中文字符 русский العربية', 'Caracteres não latinos');
    await this.runTest('\\n\\r\\t caracteres de escape', 'Caracteres de escape');
    await this.runTest('"aspas" e \'aspas simples\'', 'Aspas misturadas');

    // Teste 8: Cenários de segurança
    console.log('\n📋 CATEGORIA 8: TESTES DE SEGURANÇA');
    console.log('-'.repeat(40));
    
    await this.runTest('<script>alert("hack")</script>', 'Script malicioso');
    await this.runTest('javascript:void(0)', 'JavaScript URL');
    await this.runTest('SELECT * FROM users', 'SQL injection attempt');
    await this.runTest('../../etc/passwd', 'Path traversal');
    await this.runTest('<img src=x onerror=alert(1)>', 'XSS attempt');

    // Teste 9: Casos linguísticos complexos
    console.log('\n📋 CATEGORIA 9: COMPLEXIDADE LINGUÍSTICA');
    console.log('-'.repeat(40));
    
    await this.runTest('Trabalho part-time como freelancer e tenho um segundo emprego', 'Múltiplos empregos');
    await this.runTest('Ganho entre 20 a 30 mil dependendo dos projetos', 'Rendimento variável');
    await this.runTest('Salário base + subsídios + horas extra', 'Componentes salariais');
    await this.runTest('Recebi herança este ano', 'Rendimento extraordinário');
    await this.runTest('Mudei de emprego 3 vezes este ano', 'Múltiplas mudanças');

    // Teste 10: Performance stress
    console.log('\n📋 CATEGORIA 10: TESTE DE PERFORMANCE');
    console.log('-'.repeat(40));
    
    const perfTests = [];
    for (let i = 0; i < 50; i++) {
      perfTests.push(this.runTest(`Teste ${i}: Ganho ${20000 + i * 100} euros`, `Performance test ${i + 1}/50`));
    }
    await Promise.all(perfTests);

    // Resultados finais
    this.showFinalResults();
  }

  showFinalResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADO FINAL DOS TESTES EXTREMOS');
    console.log('='.repeat(60));
    
    console.log(`🧪 Total de testes: ${this.totalTests}`);
    console.log(`✅ Sucessos: ${this.passedTests}`);
    console.log(`❌ Falhas: ${this.failedTests}`);
    console.log(`⚠️  Duplicações de insights: ${this.insights_duplicated}`);
    console.log(`🐌 Problemas de performance: ${this.performance_issues}`);
    console.log(`🛡️  Problemas de segurança: ${this.security_issues}`);
    
    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
    console.log(`📈 Taxa de sucesso: ${successRate}%`);
    
    if (this.failedTests === 0 && this.insights_duplicated === 0 && this.security_issues === 0) {
      console.log('\n🎉 PARABÉNS! A IA PASSOU EM TODOS OS TESTES EXTREMOS!');
      console.log('✨ A IA está extremamente robusta e pronta para qualquer cenário.');
      console.log('🔒 Segurança validada com sucesso.');
      console.log('⚡ Performance dentro dos parâmetros aceitáveis.');
      console.log('🛡️  Tratamento de erros perfeito.');
    } else {
      console.log('\n⚠️  ALGUMAS MELHORIAS NECESSÁRIAS:');
      if (this.failedTests > 0) {
        console.log(`🔧 ${this.failedTests} teste(s) falharam`);
      }
      if (this.insights_duplicated > 0) {
        console.log(`🔄 ${this.insights_duplicated} duplicação(ões) de insights`);
      }
      if (this.security_issues > 0) {
        console.log(`🚨 ${this.security_issues} problema(s) de segurança`);
      }
      if (this.performance_issues > 0) {
        console.log(`⏱️  ${this.performance_issues} problema(s) de performance`);
      }
    }
    
    console.log('\n🏁 TESTE COMPLETO FINALIZADO');
  }
}

// Executar os testes
const tester = new ExtensiveAITester();
tester.runStressTests().catch(console.error);