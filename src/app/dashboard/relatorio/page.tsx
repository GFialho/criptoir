import Link from 'next/link'
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
  FileDown,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { mockTransactions, mockPortfolio2025 } from '@/lib/mock-data'
import { calculateMonthlyGains } from '@/lib/tax-engine/gains'
import { buildPositionsPEPS } from '@/lib/tax-engine/peps'

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const MONTH_NAMES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const IRPF_CODES: Record<string, string> = {
  BTC: '01 - Bitcoin',
  ETH: '02 - Altcoin (Ethereum)',
  SOL: '02 - Altcoin (Solana)',
  USDT: '03 - Stablecoin (Tether)',
}

const ASSET_COLORS: Record<string, string> = {
  BTC: 'bg-amber-100 text-amber-700',
  ETH: 'bg-indigo-100 text-indigo-700',
  SOL: 'bg-violet-100 text-violet-700',
  USDT: 'bg-emerald-100 text-emerald-700',
}

export default function RelatorioPage() {
  const emptyPositions = buildPositionsPEPS([])
  const monthlyResults = calculateMonthlyGains(mockTransactions, emptyPositions)

  const taxableMonths = monthlyResults.filter((m) => !m.isExempt && m.taxOwed > 0)
  const exemptMonths = monthlyResults.filter((m) => m.isExempt && m.totalSales > 0)
  const noSaleMonths = monthlyResults.filter((m) => m.totalSales === 0)
  const totalTax = monthlyResults.reduce((s, m) => s + m.taxOwed, 0)
  const totalGain = monthlyResults.reduce((s, m) => s + m.grossGain, 0)
  const totalExempt = exemptMonths.reduce((s, m) => s + m.totalSales, 0)

  // Completeness score
  const hasPortfolio = mockPortfolio2025.length > 0
  const hasTransactions = mockTransactions.length > 0
  const hasTaxCalc = totalTax >= 0
  const completeness = [hasPortfolio, hasTransactions, hasTaxCalc, true].filter(Boolean).length
  const completenessPercent = Math.round((completeness / 4) * 100)

  // Max gain for bar chart
  const maxGain = Math.max(...monthlyResults.map((m) => m.grossGain), 1)

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatório IRPF 2025</h1>
          <p className="text-slate-500 text-sm mt-1">
            Ano-calendário 2025 · Declaração de Ajuste Anual 2026
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          disabled
        >
          <FileDown className="h-4 w-4" />
          Baixar PDF
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">Em breve</span>
        </Button>
      </div>

      {/* Completeness progress */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <p className="font-semibold text-indigo-900">Seu relatório está {completenessPercent}% completo</p>
          </div>
          <span className="text-sm font-bold text-indigo-700">{completenessPercent}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-indigo-200">
          <div
            className="h-2.5 rounded-full bg-indigo-600 transition-all"
            style={{ width: `${completenessPercent}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-indigo-600">
          Para completar 100%: baixe o PDF quando disponível e pague os DARFs pendentes.
        </p>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Info className="h-4 w-4 text-slate-600" />
        </div>
        <div className="text-sm text-slate-600">
          Relatório gerado com o método <strong className="text-slate-900">PEPS (FIFO)</strong>,
          conforme instrução normativa da Receita Federal. Use os dados abaixo para preencher sua declaração
          no programa IRPF ou compartilhe com seu contador.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`rounded-2xl border p-6 ${totalGain >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className={`h-5 w-5 ${totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
            <p className={`text-sm font-medium ${totalGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              Ganho Total (Bruto)
            </p>
          </div>
          <p className={`text-2xl font-bold font-mono ${totalGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {formatBRL(totalGain)}
          </p>
          <p className={`text-xs mt-1 ${totalGain >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            Lucro menos custo de aquisição
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-indigo-600" />
            <p className="text-sm font-medium text-indigo-700">Total Isento</p>
          </div>
          <p className="text-2xl font-bold font-mono text-indigo-700">{formatBRL(totalExempt)}</p>
          <p className="text-xs text-indigo-600 mt-1">{exemptMonths.length} mês(es) com isenção R$35k</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-700">Imposto Total Devido</p>
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700">{formatBRL(totalTax)}</p>
          <p className="text-xs text-amber-600 mt-1">Via DARF código 4600</p>
        </div>
      </div>

      {/* Section 1: Bens e Direitos */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="font-bold text-slate-900">Bens e Direitos — Posição em 31/12/2025</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Declare estes ativos na ficha &quot;Bens e Direitos&quot; do programa IRPF 2026
            </p>
          </div>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Ficha &quot;Bens e Direitos&quot;
          </span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Código IRPF</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ativo</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Qtd em 31/12</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Custo de Aquisição</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor de Mercado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPortfolio2025.map((pos) => (
                <TableRow key={pos.asset} className="border-slate-100 hover:bg-slate-50">
                  <TableCell>
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                      {pos.irpfCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-lg px-2.5 py-0.5 text-xs font-mono font-bold ${ASSET_COLORS[pos.asset] ?? 'bg-slate-100 text-slate-700'}`}>
                        {pos.asset}
                      </span>
                      <span className="text-xs text-slate-400">{IRPF_CODES[pos.asset] ?? pos.asset}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-slate-700">
                    {pos.amount.toFixed(8)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 font-mono">
                    {formatBRL(pos.totalBRL)}
                  </TableCell>
                  <TableCell className="text-right text-slate-500 font-mono">
                    {formatBRL(pos.amount * pos.priceBRL)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Monthly gains visual */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-slate-900">Ganho de Capital Mensal — 2025</h2>
            <p className="text-sm text-slate-500 mt-0.5">Visualização dos ganhos mês a mês</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Ficha &quot;Ganhos de Capital&quot;
          </span>
        </div>

        {/* Visual bars */}
        <div className="flex h-40 items-end gap-1 mb-2">
          {monthlyResults.map((m) => {
            const heightPct = m.grossGain > 0 ? Math.max((m.grossGain / maxGain) * 100, 8) : 5
            return (
              <div key={`${m.year}-${m.month}`} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full relative group" style={{ height: '140px', display: 'flex', alignItems: 'flex-end' }}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      m.grossGain > 0 && !m.isExempt
                        ? 'bg-indigo-500 hover:bg-indigo-400'
                        : m.grossGain > 0 && m.isExempt
                        ? 'bg-emerald-400 hover:bg-emerald-300'
                        : 'bg-slate-100'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{MONTH_NAMES[m.month]?.slice(0, 3)}</span>
              </div>
            )
          })}
        </div>
        <div className="flex gap-5 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-indigo-500" />Tributável
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-emerald-400" />Isento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-slate-100 border border-slate-200" />Sem vendas
          </span>
        </div>
      </div>

      {/* Monthly table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">Detalhamento Mensal</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mês</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendas (R$)</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Custo (R$)</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ganho Bruto</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Imposto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyResults.map((m) => (
                <TableRow
                  key={`${m.year}-${m.month}`}
                  className={`border-slate-100 ${m.totalSales === 0 ? 'opacity-50' : ''}`}
                >
                  <TableCell className="font-medium text-slate-900">
                    {MONTH_NAMES[m.month]}/{m.year}
                  </TableCell>
                  <TableCell className="text-right text-slate-700">{formatBRL(m.totalSales)}</TableCell>
                  <TableCell className="text-right text-slate-500">{formatBRL(m.totalCost)}</TableCell>
                  <TableCell className={`text-right font-bold font-mono ${m.grossGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatBRL(m.grossGain)}
                  </TableCell>
                  <TableCell>
                    {m.totalSales === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                        Sem vendas
                      </span>
                    ) : m.isExempt ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle className="h-3 w-3" />
                        Isento
                      </span>
                    ) : m.taxOwed > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        <AlertCircle className="h-3 w-3" />
                        Tributável
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                        Sem ganho
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {m.taxOwed > 0 ? (
                      <span className="text-amber-600">{formatBRL(m.taxOwed)}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <span className="font-bold text-slate-900">Total Imposto Devido 2025</span>
          <span className="text-xl font-bold font-mono text-amber-600">{formatBRL(totalTax)}</span>
        </div>
      </div>

      {/* Taxable months alert */}
      {taxableMonths.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Meses tributáveis — ação necessária</p>
              <p className="text-sm text-amber-700 mb-3">
                Em {taxableMonths.map((m) => `${MONTH_NAMES[m.month]}/${m.year}`).join(', ')}, suas vendas
                ultrapassaram R$35.000. Para cada mês, gere e pague o DARF até o último dia útil do mês seguinte.
              </p>
              <Link href="/dashboard/darf">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl gap-1">
                  Ver DARFs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Exempt months */}
      {exemptMonths.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Isenções Aplicadas</h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Art. 22, Lei 9.250/95
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Nos meses abaixo, as vendas totais ficaram abaixo de R$35.000 — isentos de DARF.
          </p>
          <div className="flex flex-wrap gap-2">
            {exemptMonths.map((m) => (
              <span
                key={`${m.year}-${m.month}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 font-medium"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {MONTH_NAMES[m.month]}/{m.year} — {formatBRL(m.totalSales)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Months with no sales */}
      {noSaleMonths.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <p className="text-sm text-slate-400">
            Sem vendas registradas em: {noSaleMonths.map((m) => MONTH_NAMES[m.month]).join(', ')}.
          </p>
        </div>
      )}
    </div>
  )
}
