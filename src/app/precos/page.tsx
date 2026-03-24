import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, X, ArrowLeft } from 'lucide-react'

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  notIncluded?: string[]
  cta: string
  href: string
  highlighted: boolean
  badge?: string
}

const plans: Plan[] = [
  {
    name: 'Grátis',
    price: 'R$0',
    period: 'para sempre',
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
  },
  {
    name: 'Básico',
    price: 'R$99',
    period: '/ano',
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
  },
  {
    name: 'Pro',
    price: 'R$249',
    period: '/ano',
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
  },
  {
    name: 'Contador',
    price: 'R$499',
    period: '/ano',
    description: 'Para contadores e escritórios de contabilidade',
    features: [
      'Tudo do Pro',
      'Multi-cliente (até 50)',
      'Export contábil (SPED)',
      'Relatórios customizados',
      'White-label opcional',
      'Acesso API completo',
      'Suporte dedicado (WhatsApp)',
      'DeCripto 2026 incluso',
    ],
    cta: 'Falar com Vendas',
    href: 'mailto:vendas@criptoir.com.br',
    highlighted: false,
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

function CellValue({ val }: { val: string | boolean }) {
  if (val === true) return <CheckCircle className="mx-auto h-5 w-5 text-emerald-400" />
  if (val === false) return <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
  return <span className="text-sm font-medium">{val}</span>
}

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                ₿
              </div>
              <span className="font-bold">CriptoIR</span>
            </div>
          </div>
          <Link href="/dashboard">
            <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
              Começar Grátis
            </Button>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-16 space-y-20">
        {/* Header */}
        <div className="text-center">
          <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">Preços simples</Badge>
          <h1 className="text-4xl font-bold mb-4">Planos para todo tipo de investidor</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Sem surpresas, sem taxas ocultas. Cancele quando quiser.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border ${
                plan.highlighted
                  ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                  : 'border-border/50 bg-card/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">{plan.badge}</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/50">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison table */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Comparação detalhada</h2>
          <Card className="border-border/50 bg-card/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="py-4 px-4 text-left text-muted-foreground font-medium w-[35%]">
                      Funcionalidade
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.name}
                        className={`py-4 px-4 text-center font-semibold ${
                          p.highlighted ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {p.name}
                        {p.highlighted && (
                          <div className="text-xs font-normal text-primary/70">⭐ Mais popular</div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-muted/5' : ''}`}
                    >
                      <td className="py-3 px-4 text-muted-foreground">{row.feature}</td>
                      {row.values.map((val, j) => (
                        <td
                          key={j}
                          className={`py-3 px-4 text-center ${
                            plans[j].highlighted ? 'bg-primary/5' : ''
                          }`}
                        >
                          <CellValue val={val} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 px-4" />
                    {plans.map((plan) => (
                      <td key={plan.name} className={`py-4 px-4 text-center ${plan.highlighted ? 'bg-primary/5' : ''}`}>
                        <Link href={plan.href}>
                          <Button
                            size="sm"
                            className="w-full"
                            variant={plan.highlighted ? 'default' : 'outline'}
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
          </Card>
        </div>

        {/* FAQ */}
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-8">Dúvidas sobre os planos</h2>
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
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-5">
                  <p className="font-semibold mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 CriptoIR. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
