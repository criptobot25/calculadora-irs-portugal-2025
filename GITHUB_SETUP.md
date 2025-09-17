# 🚀 Como Subir para o GitHub

## OPÇÃO 1: 🌐 Via Website (Recomendado)

### 1. 📝 Criar Repositório no GitHub.com

1. Vá para [github.com](https://github.com) e faça login
2. Clique no botão **"New"** ou **"+"** → **"New repository"**
3. Configure o repositório:
   - **Repository name:** `calculadora-irs-portugal-2025`
   - **Description:** `🧮 Calculadora IRS Portugal 2025 - IA própria, cálculos precisos, 100% privado`
   - **Visibility:** ✅ Public (recomendado) ou Private
   - **❌ NÃO marque:** "Add a README file" (já temos)
   - **❌ NÃO marque:** "Add .gitignore" (já temos)
   - **❌ NÃO marque:** "Choose a license" (opcional)
4. Clique em **"Create repository"**

### 2. 🔗 Comandos para Executar (após criar o repo)

O GitHub mostrará comandos similares. **Execute estes no terminal:**

```bash
# Conectar ao GitHub (SUBSTITUA SEU_USERNAME pelo seu nome de usuário)
git remote add origin https://github.com/SEU_USERNAME/calculadora-irs-portugal-2025.git

# Renomear branch para main
git branch -M main

# Enviar código para GitHub
git push -u origin main
```

## OPÇÃO 2: 🛠️ Via GitHub CLI (Automatizado)

### 1. Instalar GitHub CLI

```bash
# Instalar GitHub CLI via winget
winget install --id GitHub.cli

# OU baixar de: https://cli.github.com/
```

### 2. Fazer login e criar repo automaticamente

```bash
# Login no GitHub
gh auth login

# Criar repositório automaticamente
gh repo create calculadora-irs-portugal-2025 --public --description "🧮 Calculadora IRS Portugal 2025 - IA própria, cálculos precisos, 100% privado"

# Push do código
git push -u origin main
```

---

## 📋 Informações do Projeto

**Nome sugerido:** `calculadora-irs-portugal-2025`

**Descrição sugerida:**
```
🧮 Calculadora IRS Portugal 2025 - IA própria portuguesa, cálculos precisos, interface moderna, 100% privado. Next.js 15 + TypeScript + Tailwind CSS
```

**Topics sugeridos:**
- `irs` `portugal` `tax-calculator` `nextjs` `typescript` `ai` `fiscal` `calculator` `tailwindcss`

---

## 🚀 Status Atual
✅ Código commitado localmente  
✅ Arquivo GITHUB_SETUP.md criado  
⏳ Aguardando criação do repositório no GitHub  
⏳ Aguardando push para o GitHub

## 🎯 Próximo Passo
**Escolha a OPÇÃO 1 (mais simples) ou OPÇÃO 2 (mais rápida) e siga as instruções acima!**