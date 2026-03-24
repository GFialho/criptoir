import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileText,
} from 'lucide-react'
import { mockTransactions, mockSummary, mockDARFs } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const recentTransactions = [...mockTransactions]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 8)

const TYPE_LABELS: Record<string, string> = {
  buy: 'Compra',
  sell: 'Venda',
  transfer_in: 'Depósito',
  transfer_out: 'Retirada',
  fee: 'Taxa',
  staking: 'Staking',
  airdrop: 'Airdrop',
}

export default function DashboardPage() {
  const { portfolioValueBRL, totalGainBRL, totalTaxOwedBRL, darfsPending } = mockSummary
  const isGain = totalGainBRL >= 0

  const summaryCards = [
    {
      title: 'Valor do Portfólio',
      value: formatBRL(portfolioValueBRL),
      sub: 'Posição em 31/12/2025',
      icon: DollarSign,
      iconClass: 'text-blue-400',
      bgClass: 'bg-blue-400/10',
    },
    {
      title: 'Ganho/Perda Total',
      value: formatBRL(totalGainBRL),
      sub: 'Acumulado em 2025',
      icon: isGain ? TrendingUp : TrendingDown,
      iconClass: isGain ? 'text-emerald-400' : 'text-red-400',
      bgClass: isGain ? 'bg-emerald-400/10' : 'bg-red-400/10',
      valueClass: isGain ? 'text-emerald-400' : 'text-red-400',
    },
    {
      title: 'Imposto Devido',
      value: formatBRL(totalTaxOwedBRL),
      sub: 'Ganho de capital 2025',
      icon: FileText,
      iconClass: 'text-amber-400',
      bgClass: 'bg-amber-400/10',
    },
    {
      title: 'DARFs Pendentes',
      value: String(darfsPending),
      sub: 'Aguardando pagamento',
      icon: AlertTriangle,
      iconClass: 'text-red-400',
      bgClass: 'bg-red-400/10',
      valueClass: darfsPending > 0 ? 'text-red-400' : undefined,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumo do seu portfólio de criptoativos — 2025</p>
        </div>
        <Link href="/dashboard/importar">
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <ArrowUpRight className="h-4 w-4" />
            Importar transações
          </Button>
        </Link>
      </div>

      {/* Alert */}
      {darfsPending > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400">DARFs pendentes</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Você tem <strong className="text-foreground">{darfsPending} DARFs</strong> aguardando pagamento.{' '}
            <Link href="/dashboard/darf" className="text-primary underline underline-offset-4">
              Ver DARFs →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className={`mt-1 text-2xl font-bold ${card.valueClass ?? 'text-foreground'}`}>
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
                </div>
                <div className={`rounded-lg p-2 ${card.bgClass}`}>
                  <card.icon className={`h-5 w-5 ${card.iconClass}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder + DARFs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Chart Placeholder */}
        <Card className="col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Ganho de Capital Mensal — 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Visual bar chart placeholder */}
            <div className="flex h-48 items-end gap-2">
              {[
                { month: 'Jan', gain: 0, exempt: true },
                { month: 'Fev', gain: 0, exempt: true },
                { month: 'Mar', gain: 8290, exempt: false },
                { month: 'Abr', gain: 0, exempt: true },
                { month: 'Mai', gain: 0, exempt: true },
                { month: 'Jun', gain: 14580, exempt: false },
                { month: 'Jul', gain: 0, exempt: true },
                { month: 'Ago', gain: 0, exempt: true },
                { month: 'Set', gain: 0, exempt: true },
                { month: 'Out', gain: 36050, exempt: false },
                { month: 'Nov', gain: 0, exempt: true },
                { month: 'Dez', gain: 0, exempt: true },
              ].map((item) => {
                const maxGain = 36050
                const heightPct = item.gain > 0 ? (item.gain / maxGain) * 100 : 4
                return (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        item.gain > 0 ? 'bg-primary/70' : 'bg-muted/40'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/70" /> Tributável
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted/40" /> Isento / Sem vendas
              </span>
            </div>
          </CardContent>
        </Card>

        {/* DARFs Summary */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">DARFs 2025</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDARFs.map((darf) => (
              <div
                key={darf.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{darf.competencia}</p>
                  <p className="text-xs text-muted-foreground">
                    Vence: {format(darf.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatBRL(darf.amount)}</p>
                  <Badge
                    variant="outline"
                    className={
                      darf.status === 'paid'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs'
                        : darf.status === 'overdue'
                        ? 'border-red-500/30 bg-red-500/10 text-red-400 text-xs'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs'
                    }
                  >
                    {darf.status === 'paid' ? 'Pago' : darf.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
            <Link href="/dashboard/darf">
              <Button variant="outline" size="sm" className="w-full">
                Ver todos os DARFs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Transações Recentes</CardTitle>
          <Link href="/dashboard/transacoes">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Data</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Total (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-border/50">
                  <TableCell className="text-sm text-muted-foreground">
                    {format(tx.date, 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-sm">{tx.exchange}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {tx.type === 'sell' ? (
                        <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      <span className={`text-sm ${tx.type === 'sell' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {TYPE_LABELS[tx.type] ?? tx.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border/50 text-xs font-mono">
                      {tx.asset}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-mono">
                    {tx.amount.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold">
                    {formatBRL(tx.totalBRL)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
