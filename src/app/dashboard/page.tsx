import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Bell,
  Plus,
  ChevronRight,
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
  .slice(0, 6)

const TYPE_LABELS: Record<string, string> = {
  buy: 'Compra',
  sell: 'Venda',
  transfer_in: 'Depósito',
  transfer_out: 'Retirada',
  fee: 'Taxa',
  staking: 'Staking',
  airdrop: 'Airdrop',
}

const ASSET_COLORS: Record<string, string> = {
  BTC: 'bg-amber-100 text-amber-700',
  ETH: 'bg-indigo-100 text-indigo-700',
  SOL: 'bg-violet-100 text-violet-700',
  USDT: 'bg-emerald-100 text-emerald-700',
}

const monthlyData = [
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
]

export default function DashboardPage() {
  const { portfolioValueBRL, totalGainBRL, totalTaxOwedBRL, darfsPending } = mockSummary
  const isGain = totalGainBRL >= 0

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">Bem-vindo de volta,</p>
          <h1 className="text-2xl font-bold text-slate-900">Gabriel 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Resumo do seu portfólio — ano 2025</p>
        </div>
        <Link href="/dashboard/importar">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            <Plus className="h-4 w-4" />
            Importar transações
          </Button>
        </Link>
      </div>

      {/* Alert */}
      {darfsPending > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100">
            <Bell className="h-5 w-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-rose-800">Atenção: DARFs pendentes</p>
            <p className="text-sm text-rose-600">
              Você tem <strong>{darfsPending} DARF{darfsPending > 1 ? 's' : ''}</strong> aguardando pagamento.
              Evite multas e juros.
            </p>
          </div>
          <Link href="/dashboard/darf">
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex-shrink-0 gap-1">
              Ver DARFs
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Portfolio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Valor do Portfólio</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <DollarSign className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{formatBRL(portfolioValueBRL)}</p>
          <p className="text-xs text-slate-400 mt-1">Posição em 31/12/2025</p>
          <div className="mt-3 flex items-center gap-1 text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">+12.4% no ano</span>
          </div>
        </div>

        {/* Gain/Loss */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isGain ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
          <div className="flex items-start justify-between mb-3">
            <p className={`text-sm font-medium ${isGain ? 'text-emerald-700' : 'text-rose-700'}`}>Ganho/Perda Total</p>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isGain ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              {isGain ? (
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-rose-600" />
              )}
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono ${isGain ? 'text-emerald-700' : 'text-rose-700'}`}>
            {formatBRL(totalGainBRL)}
          </p>
          <p className={`text-xs mt-1 ${isGain ? 'text-emerald-600' : 'text-rose-500'}`}>Acumulado em 2025</p>
          <div className={`mt-3 flex items-center gap-1 ${isGain ? 'text-emerald-600' : 'text-rose-500'}`}>
            {isGain ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span className="text-xs font-medium">{isGain ? 'Resultado positivo' : 'Resultado negativo'}</span>
          </div>
        </div>

        {/* Tax owed */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-amber-700">Imposto Devido</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 font-mono">{formatBRL(totalTaxOwedBRL)}</p>
          <p className="text-xs text-amber-600 mt-1">Ganho de capital 2025</p>
          <div className="mt-3 flex items-center gap-1 text-amber-600">
            <span className="text-xs font-medium">DARF código 4600</span>
          </div>
        </div>

        {/* DARFs pending */}
        <div className={`rounded-2xl border p-6 shadow-sm ${darfsPending > 0 ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-start justify-between mb-3">
            <p className={`text-sm font-medium ${darfsPending > 0 ? 'text-rose-700' : 'text-slate-500'}`}>DARFs Pendentes</p>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${darfsPending > 0 ? 'bg-rose-100' : 'bg-slate-50'}`}>
              <AlertTriangle className={`h-5 w-5 ${darfsPending > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono ${darfsPending > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
            {darfsPending}
          </p>
          <p className={`text-xs mt-1 ${darfsPending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {darfsPending > 0 ? 'Aguardando pagamento' : 'Nenhum pendente'}
          </p>
          {darfsPending > 0 && (
            <div className="mt-3">
              <Link href="/dashboard/darf">
                <span className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2">
                  Pagar agora →
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chart + DARFs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Chart */}
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900">Ganho de Capital Mensal — 2025</h3>
            </div>
            <Link href="/dashboard/relatorio">
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs">
                Ver relatório completo →
              </Button>
            </Link>
          </div>

          <div className="flex h-52 items-end gap-1.5">
            {monthlyData.map((item) => {
              const maxGain = 36050
              const heightPct = item.gain > 0 ? Math.max((item.gain / maxGain) * 100, 8) : 6
              return (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full relative group" style={{ height: '180px', display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        item.gain > 0
                          ? 'bg-indigo-500 hover:bg-indigo-400'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    {item.gain > 0 && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white">
                        {formatBRL(item.gain)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{item.month}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-indigo-500" />
              Tributável
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-slate-100 border border-slate-200" />
              Isento / Sem vendas
            </span>
          </div>
        </div>

        {/* DARFs Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">DARFs 2025</h3>
            <Link href="/dashboard/darf">
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 text-xs">
                Ver todos →
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockDARFs.map((darf) => (
              <div
                key={darf.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{darf.competencia}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Vence: {format(darf.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 font-mono">{formatBRL(darf.amount)}</p>
                  <span
                    className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      darf.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : darf.status === 'overdue'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {darf.status === 'paid' ? '✅ Pago' : darf.status === 'overdue' ? '❌ Atrasado' : '⏳ Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900">Transações Recentes</h3>
          <Link href="/dashboard/transacoes">
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1 text-sm">
              Ver todas
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50">
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Exchange</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ativo</TableHead>
              <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Qtd</TableHead>
              <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((tx) => (
              <TableRow key={tx.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                <TableCell className="text-sm text-slate-500">
                  {format(tx.date, 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-700">{tx.exchange}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      tx.type === 'sell'
                        ? 'bg-rose-100 text-rose-700'
                        : tx.type === 'buy'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tx.type === 'sell' ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {TYPE_LABELS[tx.type] ?? tx.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-mono font-bold ${
                      ASSET_COLORS[tx.asset] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.asset}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm font-mono text-slate-700">
                  {tx.amount.toFixed(4)}
                </TableCell>
                <TableCell className="text-right text-sm font-bold font-mono text-slate-900">
                  {formatBRL(tx.totalBRL)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
