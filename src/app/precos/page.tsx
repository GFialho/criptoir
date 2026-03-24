'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, X, ArrowLeft, Zap, Shield, HeadphonesIcon } from 'lucide-react'

interface Plan {
  name: string
  priceMonthly: number
  priceAnnual: number
  description: string
  features: string[]
  notIncluded?: string[]
  cta: string
  href: string
  highlighted: boolean
  badge?: string
  color: string
  badgeColor: string
}

const plans: Plan[] = [
  {
    name: 'Grátis',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Para começar e experimentar a plataforma',
    features: [
      'Até 50 transações',
      '1 exchange',
      'Cálculo ganho de capital',
      'Relatório básico (tela)',
      'Isenção automática R$35k',
    ],
    notIncluded: [
      'Geração de DARF',
      'Download PDF',
      'Múltiplas exchanges',
      'API de integração',
    ],
    cta: 'Começar Grátis',
    href: '/dashboard',
    highlighted: false,
    color: 'border-slate-200 bg-white',
    badgeColor: '',
  },
  {
    name: 'Básico',
    priceMonthly: 12,
    priceAnnual: 99,
    description: 'Para o investidor casual com poucas operações',
    features: [
      'Até 500 transações',
      '3 exchanges',
      'Cálculo ganho de capital',
      'Relatório IRPF completo',
      'Geração de DARF (PDF)',
      'Isenção automática R$35k',
      'Suporte por email',
    ],
    notIncluded: [
      'Transações ilimitadas',
      'API de integração',
      'DeFi e staking',
    ],
    cta: 'Assinar Básico',
    href: '/dashboard',
    highlighted: false,
    color: 'border-slate-200 bg-white',
    badgeColor: '',
  },
  {
    name: 'Pro',
    priceMonthly: 29,
    priceAnnual: 249,
    description: 'Para traders ativos e investidores sérios',
    features: [
      'Transações ilimitadas',
      'Todas as exchanges',
      'Cálculo ganho de capital',
      'Relatório IRPF completo',
      'Geração de DARF (PDF)',
      'DeFi, staking e airdrop',
      'API de integração',
      'Histórico completo',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    href: '/dashboard',
    highlighted: true,
    badge: 'Mais popular',
    color: 'border-indigo-600 bg-indigo-600',
    badgeColor: 'bg-amber-400 text-amber-900',
  },
  {
    name: 'Contador',
    priceMonthly: 59,
    priceAnnual: 499,
    description: 'Para contadores e escritórios de contabilidade',
    features: [
      'Tudo do Pro',
      'Multi-cliente (até 50)',
      'Export contábil (SPED)',
      'Relatórios customizados',
      'White-label opcional',
      'Acesso API completo',
      'Suporte WhatsApp dedicado',
      'DeCripto 2026 incluso',
    ],
    cta: 'Falar com Vendas',
    href: 'mailto:vendas@criptoir.com.br',
    highlighted: false,
    color: 'border-violet-200 bg-violet-50',
    badgeColor: '',
  },
]

const comparisonRows = [
  { feature: 'Transações', values: ['50', '500', 'Ilimitadas', 'Ilimitadas'] },
  { feature: 'Exchanges', values: ['1', '3', 'Todas', 'Todas'] },
  { feature: 'Cálculo ganho de capital', values: [true, true, true, true] },
  { feature: 'Isenção R$35k automática', values: [true, true, true, true] },
  { feature: 'Método PEPS/FIFO', values: [true, true, true, true] },
  { feature: 'Relatório IRPF', values: ['Básico', 'Completo', 'Completo', 'Completo'] },
  { feature: 'Download PDF', values: [false, true, true, true] },
  { feature: 'Geração de DARF', values: [false, true, true, true] },
  { feature: 'DeFi / Staking / Airdrop', values: [false, false, true, true] },
  { feature: 'API de integração', values: [false, false, true, true] },
  { feature: 'Multi-cliente', values: [false, false, false, true] },
  { feature: 'Export contábil (SPED)', values: [false, false, false, true] },
  { feature: 'DeCripto 2026', values: [false, false, false, true] },
]

function CellValue({ val, highlighted }: { val: string | boolean; highlighted: boolean }) {
  if (val === true) return <CheckCircle className={`mx-auto h-5 w-5 ${highlighted ? 'text-emerald-300' : 'text-emerald-500'}`} />
  if (val === false) return <X className={`mx-auto h-5 w-5 ${highlighted ? 'text-indigo-400' : 'text-slate-200'}`} />
  return (
    <span className={`text-sm font-semibold ${highlighted ? 'text-white' : 'text-slate-700'}`}>
      {val}
    </span>
  )
}

export default function PrecosPage() {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            <Separator orientation="vertical" className="h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs">
                ₿
              </div>
              <span className="font-bold text-slate-900">CriptoIR</span>
            </div>
          </div>
          <Link href="/dashboard">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5">
              Começar Grátis
            </Button>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-16 space-y-20">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            Preços simples e transparentes
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Planos para todo tipo de investidor
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
            Sem surpresas, sem taxas ocultas. Cancele quando quiser.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                !annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Anual
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly
            const isHighlighted = plan.highlighted
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all ${
                  isHighlighted
                    ? 'border-indigo-600 bg-indigo-600 shadow-xl shadow-indigo-200'
                    : plan.name === 'Contador'
                    ? 'border-violet-200 bg-violet-50 shadow-sm'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${plan.badgeColor}`}>
                      ⭐ {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={`text-lg font-bold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-1 ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {plan.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                        {price === 0 ? 'Grátis' : `R$${price}`}
                      </span>
                      {price > 0 && (
                        <span className={`text-sm ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                          /{annual ? 'ano' : 'mês'}
                        </span>
                      )}
                    </div>
                    {annual && price > 0 && (
                      <p className={`text-xs mt-1 ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                        R${(price / 12).toFixed(0)}/mês cobrado anualmente
                      </p>
                    )}
                  </div>
                </div>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isHighlighted ? 'text-indigo-100' : 'text-slate-600'}`}>
                      <CheckCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isHighlighted ? 'text-emerald-300' : 'text-indigo-600'}`} />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded?.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isHighlighted ? 'text-indigo-400' : 'text-slate-300'}`}>
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full rounded-xl font-semibold ${
                      isHighlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : plan.name === 'Contador'
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, label: 'Pagamento 100% seguro' },
            { icon: Zap, label: 'Ativação imediata' },
            { icon: HeadphonesIcon, label: 'Suporte em português' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-slate-500">
              <item.icon className="h-5 w-5 text-indigo-600" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Comparação detalhada</h2>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-[35%]">
                      Funcionalidade
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.name}
                        className={`py-4 px-4 text-center font-bold ${
                          p.highlighted
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-900'
                        }`}
                      >
                        {p.name}
                        {p.highlighted && (
                          <div className="text-xs font-normal text-indigo-200 mt-0.5">⭐ Mais popular</div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}
                    >
                      <td className="py-3.5 px-5 text-slate-600 text-sm">{row.feature}</td>
                      {row.values.map((val, j) => (
                        <td
                          key={j}
                          className={`py-3.5 px-4 text-center ${
                            plans[j].highlighted ? 'bg-indigo-600' : ''
                          }`}
                        >
                          <CellValue val={val} highlighted={plans[j].highlighted} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-white border-t border-slate-200">
                    <td className="py-5 px-5" />
                    {plans.map((plan) => (
                      <td
                        key={plan.name}
                        className={`py-5 px-4 text-center ${plan.highlighted ? 'bg-indigo-600' : ''}`}
                      >
                        <Link href={plan.href}>
                          <Button
                            size="sm"
                            className={`w-full rounded-xl ${
                              plan.highlighted
                                ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                : plan.name === 'Contador'
                                ? 'bg-violet-600 text-white hover:bg-violet-700'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {plan.cta}
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Dúvidas sobre os planos</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Posso mudar de plano depois?',
                a: 'Sim, você pode fazer upgrade ou downgrade a qualquer momento. Cobranças são ajustadas proporcionalmente.',
              },
              {
                q: 'Posso usar PIX para pagar?',
                a: 'Sim! Aceitamos PIX, cartão de crédito e boleto bancário.',
              },
              {
                q: 'Meus dados continuam disponíveis se cancelar?',
                a: 'Sim, você terá acesso de leitura aos seus dados por 90 dias após o cancelamento.',
              },
              {
                q: 'O plano Contador suporta quantos clientes?',
                a: 'O plano Contador padrão suporta até 50 clientes. Para volumes maiores, entre em contato para um plano Enterprise.',
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900 mb-2">{faq.q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center">
        <p className="text-sm text-slate-400">© 2026 CriptoIR. Todos os direitos reservados.</p>
        <p className="text-xs text-slate-300 mt-1">
          Preços sujeitos a alteração. Consulte os termos de uso.
        </p>
      </footer>
    </div>
  )
}
