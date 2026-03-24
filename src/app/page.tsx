import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'lucide-react'

const features = [
  {
    icon: FileUp,
    title: 'Importação de CSV',
    description:
      'Importe diretamente do histórico da Binance, Mercado Bitcoin, Foxbit, Novadax e mais. Formato genérico também aceito.',
  },
  {
    icon: Calculator,
    title: 'Cálculo automático',
    description:
      'Motor PEPS (FIFO) conforme exigência da Receita Federal. Isenção automática para meses com vendas < R$35.000.',
  },
  {
    icon: FileText,
    title: 'Relatório IRPF',
    description:
      'Gera o relatório completo para preencher a ficha "Bens e Direitos" e "Ganhos de Capital" da declaração anual.',
  },
  {
    icon: CreditCard,
    title: 'DARF pronto',
    description:
      'Gera o DARF código 4600 com valor e vencimento calculados automaticamente. Só pagar.',
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

const plans = [
  {
    name: 'Grátis',
    price: 'R$0',
    period: '',
    description: 'Para começar e testar',
    features: [
      'Até 50 transações',
      '1 exchange',
      'Relatório básico',
      'Sem DARF',
    ],
    cta: 'Começar Grátis',
    href: '/dashboard',
    highlighted: false,
  },
  {
    name: 'Básico',
    price: 'R$99',
    period: '/ano',
    description: 'Para o investidor casual',
    features: [
      '500 transações',
      '3 exchanges',
      'Relatório completo',
      'Geração de DARF',
      'Download PDF',
    ],
    cta: 'Assinar Básico',
    href: '/precos',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'R$249',
    period: '/ano',
    description: 'Para quem opera bastante',
    features: [
      'Transações ilimitadas',
      'Todas as exchanges',
      'API de integração',
      'DeFi e staking',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    href: '/precos',
    highlighted: true,
  },
  {
    name: 'Contador',
    price: 'R$499',
    period: '/ano',
    description: 'Para contadores e escritórios',
    features: [
      'Multi-cliente',
      'Export contábil',
      'Relatórios customizados',
      'Suporte dedicado',
      'White-label',
    ],
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              ₿
            </div>
            <span className="font-bold text-lg text-foreground">CriptoIR</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground transition-colors">Funcionalidades</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Preços</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[800px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <Badge className="mb-6 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20">
            🚀 Pronto para a temporada de IR 2026
          </Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Declare suas criptomoedas
            <br />
            <span className="text-primary">no IR sem dor de cabeça</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Importe suas transações, calcule ganho de capital e gere DARFs automaticamente.
            100% adaptado às regras da Receita Federal brasileira.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:opacity-90 px-8">
                Começar Grátis
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8">
                Ver como funciona
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Sem cartão de crédito · 50 transações grátis · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-border/50 bg-muted/20 py-10 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-8 text-sm text-muted-foreground">COMPATÍVEL COM AS PRINCIPAIS EXCHANGES</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            {['Binance', 'Mercado Bitcoin', 'Foxbit', 'Novadax', 'Bitget', 'Genérico'].map((ex) => (
              <span key={ex} className="font-semibold text-foreground/70">{ex}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Tudo que você precisa em um só lugar</h2>
            <p className="text-lg text-muted-foreground">
              Do import ao DARF, passando pelo relatório IRPF — automatizado e correto.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/10 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
                100% brasileiro
              </Badge>
              <h2 className="mb-6 text-4xl font-bold">
                Feito para as regras
                <br />
                <span className="text-primary">da Receita Federal</span>
              </h2>
              <p className="mb-8 text-muted-foreground">
                Não é uma tradução do Koinly. É um produto construído do zero para o sistema tributário
                brasileiro, com todas as peculiaridades da RF, DeCripto 2026 e DARF código 4600.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Rápido', desc: 'Import e cálculo em segundos, não horas' },
                { icon: Shield, title: 'Seguro', desc: 'Dados criptografados, nunca compartilhados' },
                { icon: TrendingUp, title: 'Preciso', desc: 'Cálculos auditáveis com trilha completa' },
              ].map((item) => (
                <Card key={item.title} className="border-border/50 bg-card/50">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Planos simples e transparentes</h2>
            <p className="text-lg text-muted-foreground">Sem surpresas. Pague só o que usar.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border flex flex-col ${
                  plan.highlighted
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border/50 bg-card/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Mais popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <ul className="flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className="mt-auto">
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
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted/10 px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Perguntas frequentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-semibold text-foreground">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold">
            Pronto para declarar
            <br />
            <span className="text-primary">sem stress?</span>
          </h2>
          <p className="mb-8 text-muted-foreground">
            Comece grátis hoje. Sem cartão de crédito, sem burocracia.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:opacity-90 px-10">
              Começar Grátis
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-10 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              ₿
            </div>
            <span className="font-semibold text-foreground">CriptoIR</span>
          </div>
          <p>© 2026 CriptoIR. Todos os direitos reservados.</p>
          <p className="mt-1">
            Este produto não é um serviço de contabilidade. Consulte um contador para casos complexos.
          </p>
        </div>
      </footer>
    </div>
  )
}
