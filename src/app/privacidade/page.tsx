'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, FileText, Mail, AlertCircle } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A sua privacidade é fundamental para nós. Saiba como protegemos 
            os seus dados pessoais em conformidade com o RGPD.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-green-800">
              <Lock className="h-5 w-5" />
              <span className="font-medium">100% Seguro e Privado</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Os seus dados são processados localmente e nunca enviados para servidores externos.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-20">
        {/* Quick Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Resumo Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Não Armazenamos Dados</h3>
                <p className="text-sm text-gray-600">
                  Todos os cálculos são feitos no seu dispositivo. Nenhum dado pessoal é enviado para os nossos servidores.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">RGPD Compliant</h3>
                <p className="text-sm text-gray-600">
                  Totalmente em conformidade com o Regulamento Geral de Proteção de Dados europeu.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Transparência Total</h3>
                <p className="text-sm text-gray-600">
                  Explicamos claramente como os seus dados são tratados, sem termos complicados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1: Data Controller */}
          <Card>
            <CardHeader>
              <CardTitle>1. Responsável pelo Tratamento de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                O responsável pelo tratamento dos dados pessoais recolhidos através desta aplicação é:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Calculadora IRS 2025</strong></p>
                <p>Email: privacidade@calculadora-irs.pt</p>
                <p>Responsável: Equipa de Desenvolvimento</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle>2. Dados Recolhidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Dados da Calculadora (Processamento Local)</h4>
                <p className="text-green-700 text-sm mb-2">
                  Os seguintes dados são introduzidos por si na calculadora mas <strong>não são enviados para servidores externos</strong>:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Informações sobre rendimentos (salários, pensões, rendimentos independentes)</li>
                  <li>• Estado civil e número de dependentes</li>
                  <li>• Despesas dedutíveis (saúde, educação, habitação)</li>
                  <li>• Retenções na fonte</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Dados de Navegação (Automáticos)</h4>
                <p className="text-blue-700 text-sm mb-2">
                  Recolhemos automaticamente dados técnicos básicos para melhorar o serviço:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Endereço IP (anonimizado)</li>
                  <li>• Tipo de navegador e sistema operativo</li>
                  <li>• Páginas visitadas e tempo de permanência</li>
                  <li>• Referências de origem (como chegou ao site)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Formulário de Contacto</h4>
                <p className="text-yellow-700 text-sm mb-2">
                  Quando nos contacta através do formulário, recolhemos:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Nome e endereço de email</li>
                  <li>• Assunto e mensagem</li>
                  <li>• Data e hora do contacto</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Purpose of Processing */}
          <Card>
            <CardHeader>
              <CardTitle>3. Finalidade do Tratamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Calculadora de IRS</h4>
                  <p className="text-gray-700 text-sm">
                    Os dados introduzidos na calculadora são processados exclusivamente no seu dispositivo 
                    para calcular o IRS. Não são transmitidos nem armazenados nos nossos servidores.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Melhoria do Serviço</h4>
                  <p className="text-gray-700 text-sm">
                    Os dados de navegação ajudam-nos a compreender como os utilizadores interagem 
                    com o site para melhorar a experiência e funcionalidades.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suporte ao Cliente</h4>
                  <p className="text-gray-700 text-sm">
                    Os dados do formulário de contacto são utilizados exclusivamente para responder 
                    às suas questões e fornecer suporte técnico.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle>4. Base Legal do Tratamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Consentimento (Art.º 6.º, n.º 1, alínea a) do RGPD)</p>
                    <p className="text-gray-700 text-sm">
                      Para o formulário de contacto e cookies não essenciais.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Interesses Legítimos (Art.º 6.º, n.º 1, alínea f) do RGPD)</p>
                    <p className="text-gray-700 text-sm">
                      Para análise de tráfego e melhoria do serviço, sempre respeitando os seus direitos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>5. Partilha de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-2">Não Partilhamos Dados Pessoais</h4>
                <p className="text-red-700 text-sm">
                  Os seus dados pessoais não são vendidos, alugados ou partilhados com terceiros 
                  para fins comerciais.
                </p>
              </div>
              
              <p className="text-gray-700 text-sm mb-3">
                Podemos apenas partilhar dados em circunstâncias muito específicas:
              </p>
              
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>Prestadores de Serviços:</strong> Empresas que nos ajudam a operar o website (hosting, analytics) sob acordos de confidencialidade</li>
                <li>• <strong>Obrigações Legais:</strong> Quando exigido por lei ou autoridades competentes</li>
                <li>• <strong>Proteção de Direitos:</strong> Para proteger os nossos direitos, propriedade ou segurança</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>6. Período de Conservação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Dados da Calculadora</h4>
                  <p className="text-gray-700 text-sm">
                    Não conservados - processados apenas localmente no seu dispositivo.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Dados de Navegação</h4>
                  <p className="text-gray-700 text-sm">
                    Conservados por até 24 meses para análise estatística.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Contactos</h4>
                  <p className="text-gray-700 text-sm">
                    Conservados por até 3 anos para fins de suporte e melhoria do serviço.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>7. Os Seus Direitos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-4">
                Ao abrigo do RGPD, tem os seguintes direitos sobre os seus dados pessoais:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Direito de Acesso</h4>
                    <p className="text-gray-700 text-sm">Saber que dados temos sobre si</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Direito de Retificação</h4>
                    <p className="text-gray-700 text-sm">Corrigir dados incorretos</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Direito ao Apagamento</h4>
                    <p className="text-gray-700 text-sm">Solicitar a eliminação dos seus dados</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Direito à Portabilidade</h4>
                    <p className="text-gray-700 text-sm">Receber os seus dados em formato estruturado</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Direito de Oposição</h4>
                    <p className="text-gray-700 text-sm">Opor-se ao tratamento dos seus dados</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Direito de Reclamação</h4>
                    <p className="text-gray-700 text-sm">Apresentar queixa à CNPD</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Como Exercer os Seus Direitos</h4>
                <p className="text-blue-700 text-sm">
                  Para exercer qualquer um destes direitos, contacte-nos através do email 
                  <a href="mailto:privacidade@calculadora-irs.pt" className="underline">privacidade@calculadora-irs.pt</a>. 
                  Responderemos no prazo de 30 dias.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Security */}
          <Card>
            <CardHeader>
              <CardTitle>8. Segurança dos Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-4">
                Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Encriptação HTTPS</h4>
                    <p className="text-gray-700 text-sm">
                      Todas as comunicações são encriptadas usando SSL/TLS.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Processamento Local</h4>
                    <p className="text-gray-700 text-sm">
                      Os cálculos de IRS são feitos no seu dispositivo, não nos nossos servidores.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Acesso Restrito</h4>
                    <p className="text-gray-700 text-sm">
                      Apenas pessoal autorizado tem acesso aos dados necessários para operação.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 9: Changes */}
          <Card>
            <CardHeader>
              <CardTitle>9. Alterações à Política</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Esta política de privacidade pode ser atualizada periodicamente para refletir 
                mudanças na lei ou nos nossos serviços. Notificaremos sobre alterações significativas 
                através do website ou por email, quando aplicável.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  <strong>Última atualização:</strong> 15 de janeiro de 2025
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Contacto para Questões de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-4">
                Se tiver dúvidas sobre esta política de privacidade ou sobre como tratamos 
                os seus dados pessoais, não hesite em contactar-nos:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p><strong>Email:</strong> privacidade@calculadora-irs.pt</p>
                <p><strong>Assunto:</strong> Questão de Privacidade - RGPD</p>
                <p className="text-sm text-blue-700 mt-2">
                  Responderemos a todas as questões no prazo máximo de 30 dias.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}