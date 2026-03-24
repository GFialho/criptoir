# CriptoIR — Roadmap

> **Declaração de imposto de renda de criptomoedas para brasileiros.**
> O Koinly do Brasil — simples, em português, com PIX e regras da Receita Federal.

---

## 🎯 Visão

Ferramenta SaaS que importa transações de exchanges e wallets, calcula ganho de capital segundo regras brasileiras, e gera relatórios prontos para declarar no IRPF + DARFs de pagamento mensal.

## 📊 Mercado

- **~10M+ de brasileiros** declararam criptoativos em 2025
- Receita Federal obriga declaração de cripto >= R$5.000 por tipo
- DeCripto (nova declaração) obrigatória a partir de julho/2026
- Dados pré-preenchidos pela RF na declaração 2026
- Nenhum player BR sério — Koinly/CoinTracker têm suporte BR fraco
- **Timing perfeito:** temporada de IR (março-maio) + DeCripto (julho)

## 🏗️ Regras Tributárias BR (Cripto)

### Declaração obrigatória:
- Criptoativos com custo de aquisição >= R$5.000 por tipo em 31/12
- Ficha "Bens e Direitos" do IRPF
- Códigos: 01 (Bitcoin), 02 (altcoins), 03 (stablecoins), 10 (NFTs), 99 (outros)

### Ganho de Capital:
- Isento se vendas totais no mês <= R$35.000
- Alíquota 15% sobre ganho de capital (vendas > R$35.000/mês)
- Alíquotas progressivas acima de R$5M (17.5%, 20%, 22.5%)
- DARF deve ser pago até último dia útil do mês seguinte à venda
- Prejuízo pode ser compensado com lucro futuro (mesmo tipo de ativo)

### Exchanges estrangeiras (2025+):
- Ficha separada para patrimônio no exterior (sem CNPJ)
- Regras de tributação de ativos no exterior (Lei 14.754/2023)

## 🚀 MVP (2-3 semanas)

### Core Features:
1. **Import de transações**
   - Upload CSV (Binance, Mercado Bitcoin, Foxbit, Novadax, Bitget)
   - Formato genérico (date, type, asset, amount, price, fee)
   
2. **Cálculo de ganho de capital**
   - Método PEPS (Primeiro que Entra, Primeiro que Sai) — padrão RF
   - Custo médio ponderado (alternativa aceita)
   - Isenção automática mês < R$35.000 em vendas
   - Alíquotas progressivas

3. **Relatório IRPF**
   - Bens e Direitos (posição em 31/12)
   - Ganhos de Capital por mês
   - Resumo de isenções

4. **Geração de DARF**
   - Código 4600 (ganho de capital)
   - Valor + vencimento calculados automaticamente
   - PDF pronto para pagar

### Tech Stack:
- **Frontend:** Next.js 15 + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API routes (monolito pra começar) → migrar pra Lambda depois
- **Database:** DynamoDB (AWS, profile nexbo)
- **Auth:** NextAuth.js + AWS Cognito
- **Deploy:** AWS Amplify (profile nexbo, region us-east-2)
- **Parsing:** Papa Parse (CSV) + custom parsers por exchange
- **AWS Profile:** nexbo (mesma infra do TriboVip)

### Páginas MVP:
```
/ ..................... Landing page (SEO)
/login ................ Auth
/dashboard ............ Resumo: posição, impostos devidos, alertas
/transacoes ........... Lista de transações importadas
/importar ............. Upload CSV + seleção de exchange
/relatorio ............ Relatório IRPF + download PDF
/darf ................. DARFs gerados + status pagamento
/precos ............... Planos e pricing
```

## 💰 Pricing

| Plano | Preço | Features |
|-------|-------|----------|
| Grátis | R$0 | Até 50 transações, 1 exchange, relatório básico |
| Básico | R$99/ano | 500 transações, 3 exchanges, DARF, relatório completo |
| Pro | R$249/ano | Ilimitado, todas exchanges, API, DeFi, staking |
| Contador | R$499/ano | Multi-cliente, export contábil, suporte prioritário |

## 📅 Timeline

### Semana 1 (24-30 Mar) — Fundação
- [x] Repo + roadmap
- [ ] Setup Next.js + Tailwind + shadcn/ui + Supabase
- [ ] Landing page (SEO-optimized)
- [ ] Auth (Google + email)
- [ ] DB schema (users, transactions, portfolios, tax_reports)
- [ ] CSV parser: Binance + Mercado Bitcoin

### Semana 2 (31 Mar - 6 Abr) — Core Engine
- [ ] Motor de cálculo: PEPS + custo médio
- [ ] Isenção R$35k automática
- [ ] Dashboard com resumo
- [ ] Página de transações (lista + filtros)
- [ ] CSV parser: Foxbit, Novadax, Bitget
- [ ] Cotações históricas (CoinGecko API)

### Semana 3 (7-13 Abr) — Relatórios + Polish
- [ ] Geração relatório IRPF (PDF)
- [ ] Geração DARF (PDF)
- [ ] Página de pricing + Stripe/Asaas
- [ ] Onboarding flow
- [ ] SEO: 5 artigos no blog
- [ ] Soft launch (Product Hunt, Reddit, Twitter)

### Fase 2 (Abr-Mai) — Escalar
- [ ] API de exchanges (auto-import)
- [ ] DeFi: swap, liquidity, staking, farming
- [ ] Alertas: "você tem DARF vencendo"
- [ ] Integração contadores (export SPED)
- [ ] DeCripto (nova declaração RF, julho/2026)
- [ ] App mobile (React Native ou PWA)

## 🏆 Diferenciais vs Concorrência

| Feature | CriptoIR | Koinly | CoinTracker | Declara Bitcoin |
|---------|----------|--------|-------------|-----------------|
| PT-BR nativo | ✅ | ❌ (EN) | ❌ (EN) | ✅ |
| Regras RF brasileiras | ✅ | Parcial | ❌ | ✅ |
| PIX payment | ✅ | ❌ | ❌ | ❌ |
| Geração DARF | ✅ | ❌ | ❌ | ✅ |
| Exchanges BR | ✅ | Parcial | Parcial | ✅ |
| DeFi support | ✅ (fase 2) | ✅ | ✅ | ❌ |
| Preço | R$99/ano | $49+/ano | $59+/ano | R$? |
| DeCripto (2026) | ✅ (fase 2) | ❌ | ❌ | ? |

## 🔑 SEO Keywords

- "declarar criptomoedas imposto de renda"
- "calcular imposto bitcoin brasil"
- "DARF criptomoedas como gerar"
- "koinly alternativa brasil"
- "imposto de renda crypto 2026"
- "isenção 35 mil reais criptomoedas"
- "como declarar bitcoin receita federal"
