'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileUp,
  Calculator,
  FileText,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Star,
  Lock,
  Globe,
  HeadphonesIcon,
  ChevronDown,
  ArrowRight,
  BarChart3,
  Users,
  Activity,
} from 'lucide-react'

const features = [
  {
    icon: FileUp,
    title: 'Importação de CSV',
    description:
      'Importe diretamente do histórico da Binance, Mercado Bitcoin, Foxbit, Novadax e mais. Formato genérico também aceito.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Calculator,
    title: 'Cálculo automático',
    description:
      'Motor PEPS (FIFO) conforme exigência da Receita Federal. Isenção automática para meses com vendas < R$35.000.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: FileText,
    title: 'Relatório IRPF',
    description:
      'Gera o relatório completo para preencher a ficha "Bens e Direitos" e "Ganhos de Capital" da declaração anual.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: CreditCard,
    title: 'DARF pronto',
    description:
      'Gera o DARF código 4600 com valor e vencimento calculados automaticamente. Só pagar.',
    color: 'bg-amber-50 text-amber-600',
  },
]

const steps = [
  {
    number: '01',
    title: 'Importe suas transações',
    description: 'Conecte sua exchange favorita ou faça upload do CSV. Binance, Mercado Bitcoin, Foxbit e mais.',
    icon: FileUp,
  },
  {
    number: '02',
    title: 'Calculamos tudo automaticamente',
    description: 'Nosso motor PEPS/FIFO calcula ganho de capital, aplica isenções e apura o imposto devido.',
    icon: Calculator,
  },
  {
    number: '03',
    title: 'Declare e pague com segurança',
    description: 'Baixe o relatório para o IRPF e gere o DARF código 4600 pronto para pagamento.',
    icon: FileText,
  },
]

const benefits = [
  'Regras 100% brasileiras (Receita Federal)',
  'Método PEPS (FIFO) oficial',
  'Isenção R$35k aplicada automaticamente',
  'Alíquotas progressivas corretas',
  'Suporte a exchanges nacionais e internacionais',
  'Compensação de prejuízos futuros',
]

const testimonials = [
  {
    name: 'Rafael Mendes',
    role: 'Investidor de cripto desde 2019',
    text: 'Finalmente uma plataforma que entende as regras brasileiras. Economizei horas tentando fazer isso na planilha. Recomendo demais!',
    stars: 5,
    initials: 'RM',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    name: 'Ana Carolina Lima',
    role: 'Trader ativa na Binance e MB',
    text: 'O relatório para o IRPF saiu em minutos. Já usei outros apps gringos mas esse é o único que respeita as regras da Receita Federal.',
    stars: 5,
    initials: 'AL',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Pedro Alves',
    role: 'Contador especializado em cripto',
    text: 'Uso o plano Contador com vários clientes. A precisão dos cálculos PEPS é impecável. Produto de qualidade real.',
    stars: 5,
    initials: 'PA',
    color: 'bg-violet-100 text-violet-700',
  },
]

const plans = [
  {
    name: 'Grátis',
    price: 'R$0',
    period: '',
    description: 'Para começar e testar',
    features: ['Até 50 transações', '1 exchange', 'Relatório básico', 'Isenção automática'],
    cta: 'Começar Grátis',
    href: '/dashboard',
    highlighted: false,
  },
  {
    name: 'Básico',
    price: 'R$99',
    period: '/ano',
    description: 'Para o investidor casual',
    features: ['500 transações', '3 exchanges', 'Relatório completo', 'Geração de DARF', 'Download PDF'],
    cta: 'Assinar Básico',
    href: '/precos',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'R$249',
    period: '/ano',
    description: 'Para quem opera bastante',
    features: ['Transações ilimitadas', 'Todas as exchanges', 'API de integração', 'DeFi e staking', 'Suporte prioritário'],
    cta: 'Assinar Pro',
    href: '/precos',
    highlighted: true,
  },
  {
    name: 'Contador',
    price: 'R$499',
    period: '/ano',
    description: 'Para contadores e escritórios',
    features: ['Multi-cliente', 'Export contábil', 'Relatórios customizados', 'Suporte dedicado', 'White-label'],
    cta: 'Falar com Vendas',
    href: '/precos',
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'Preciso declarar minhas criptomoedas no IR?',
    a: 'Sim. A Receita Federal exige a declaração de criptoativos com custo de aquisição igual ou superior a R$5.000 por tipo na ficha "Bens e Direitos". Além disso, vendas que geram lucro podem estar sujeitas ao pagamento de DARF mensal.',
  },
  {
    q: 'O que é a isenção de R$35.000?',
    a: 'Se o total das suas vendas de criptoativos em um único mês for igual ou inferior a R$35.000, o ganho de capital desse mês é isento de IR. Se ultrapassar esse valor, aplica-se alíquota de 15% sobre o lucro (ou progressiva acima de R$5M).',
  },
  {
    q: 'O que é DARF e quando devo pagar?',
    a: 'DARF (Documento de Arrecadação de Receitas Federais) é o boleto usado para pagar imposto de renda sobre ganho de capital. O código para criptoativos é 4600. Deve ser pago até o último dia útil do mês seguinte às vendas tributáveis.',
  },
  {
    q: 'Qual método de custo é usado?',
    a: 'Utilizamos o método PEPS (Primeiro que Entra, Primeiro que Sai), também conhecido como FIFO, que é o método padrão aceito pela Receita Federal para calcular o custo de aquisição em vendas de criptoativos.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Seus dados são armazenados com criptografia em servidores seguros. Nunca compartilhamos informações com terceiros. Você pode deletar seus dados a qualquer momento.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-slate-600 leading-relaxed text-sm">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
              ₿
            </div>
            <span className="font-bold text-lg text-slate-900">CriptoIR</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <Link href="#como-funciona" className="hover:text-slate-900 transition-colors">Como funciona</Link>
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">Preços</Link>
            <Link href="#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-28 text-center">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          <Badge className="mb-6 border-indigo-500/40 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
            🚀 Pronto para a temporada de IR 2026
          </Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Declare suas criptomoedas
            <br />
            <span className="text-indigo-400">no IR sem dor de cabeça</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-300">
            Importe suas transações, calcule ganho de capital e gere DARFs automaticamente.
            100% adaptado às regras da Receita Federal brasileira.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-xl text-base">
                Começar Grátis
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button
                size="lg"
                variant="outline"
                className="px-8 rounded-xl text-base border-slate-600 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Ver como funciona
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Sem cartão de crédito · 50 transações grátis · Cancele quando quiser
          </p>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Lock, label: 'Dados criptografados' },
              { icon: Shield, label: 'Conforme Receita Federal' },
              { icon: HeadphonesIcon, label: 'Suporte em PT-BR' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-slate-400 text-sm">
                <item.icon className="h-4 w-4 text-emerald-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Users, value: '12.400+', label: 'Usuários ativos' },
              { icon: Activity, value: '2.8M+', label: 'Transações processadas' },
              { icon: BarChart3, value: 'R$48M+', label: 'Em impostos calculados' },
              { icon: Star, value: '4.9/5', label: 'Avaliação dos usuários' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <stat.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchanges */}
      <section className="border-b border-slate-100 px-4 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Compatível com as principais exchanges
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['Binance', 'Mercado Bitcoin', 'Foxbit', 'Novadax', 'Bitget', 'Formato Genérico'].map((ex) => (
              <span key={ex} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                {ex}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="px-4 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-indigo-200 bg-indigo-50 text-indigo-700">Simples assim</Badge>
            <h2 className="mb-4 text-4xl font-bold text-slate-900">3 passos para declarar cripto no IR</h2>
            <p className="text-lg text-slate-500">
              Da importação ao DARF, tudo automatizado e correto.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-full hidden w-full md:block">
                    <ArrowRight className="mx-auto h-5 w-5 text-slate-300" />
                  </div>
                )}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="mb-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">{step.number}</div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Tudo que você precisa em um só lugar</h2>
            <p className="text-lg text-slate-500">
              Do import ao DARF, passando pelo relatório IRPF — automatizado e correto.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <Badge className="mb-4 border-indigo-200 bg-indigo-50 text-indigo-700">
                100% brasileiro
              </Badge>
              <h2 className="mb-6 text-4xl font-bold text-slate-900">
                Feito para as regras
                <br />
                <span className="text-indigo-600">da Receita Federal</span>
              </h2>
              <p className="mb-8 text-slate-500 leading-relaxed">
                Não é uma tradução do Koinly. É um produto construído do zero para o sistema tributário
                brasileiro, com todas as peculiaridades da RF, DeCripto 2026 e DARF código 4600.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Rápido', desc: 'Import e cálculo em segundos, não horas', color: 'bg-amber-50 text-amber-600' },
                { icon: Shield, title: 'Seguro', desc: 'Dados criptografados, nunca compartilhados', color: 'bg-indigo-50 text-indigo-600' },
                { icon: TrendingUp, title: 'Preciso', desc: 'Cálculos auditáveis com trilha completa', color: 'bg-emerald-50 text-emerald-600' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">O que nossos usuários dizem</h2>
            <p className="text-slate-500">Mais de 12.000 investidores já declararam com o CriptoIR</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-5 text-slate-600 leading-relaxed text-sm">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-indigo-200 bg-indigo-50 text-indigo-700">Preços simples</Badge>
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Planos simples e transparentes</h2>
            <p className="text-slate-500 text-lg">Sem surpresas. Pague só o que usar.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'border-indigo-600 bg-indigo-600 shadow-xl shadow-indigo-200'
                    : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">
                      ⭐ Mais popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className={`font-bold text-lg ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-1 ${plan.highlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {plan.description}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-slate-600'}`}>
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? 'text-emerald-300' : 'text-indigo-600'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full rounded-xl ${
                      plan.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">
            Todos os planos incluem cálculo PEPS/FIFO e isenção automática de R$35k
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Perguntas frequentes</h2>
            <p className="text-slate-500">Tudo que você precisa saber sobre declarar cripto no IR</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-24 bg-gradient-to-br from-indigo-600 to-indigo-800 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Pronto para declarar
            <br />
            sem stress?
          </h2>
          <p className="mb-8 text-indigo-200 text-lg">
            Comece grátis hoje. Sem cartão de crédito, sem burocracia.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-10 rounded-xl text-base font-semibold"
            >
              Começar Grátis
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Lock, label: 'Dados protegidos' },
              { icon: Globe, label: '100% online' },
              { icon: Shield, label: 'Conforme Receita Federal' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-indigo-200 text-sm">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
                ₿
              </div>
              <span className="font-bold text-slate-900">CriptoIR</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <Link href="/precos" className="hover:text-slate-600 transition-colors">Preços</Link>
              <Link href="#faq" className="hover:text-slate-600 transition-colors">FAQ</Link>
              <Link href="/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            <p>© 2026 CriptoIR. Todos os direitos reservados.</p>
            <p className="mt-1">
              Este produto não é um serviço de contabilidade. Consulte um contador para casos complexos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
