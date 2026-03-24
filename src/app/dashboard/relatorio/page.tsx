import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { FileDown, CheckCircle, AlertCircle, Info } from 'lucide-react'
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

export default function RelatorioPage() {
  // Calcular ganhos mensais com os dados mock
  const emptyPositions = buildPositionsPEPS([])
  const monthlyResults = calculateMonthlyGains(mockTransactions, emptyPositions)

  const taxableMonths = monthlyResults.filter((m) => !m.isExempt && m.taxOwed > 0)
  const exemptMonths = monthlyResults.filter((m) => m.isExempt && m.totalSales > 0)
  const totalTax = monthlyResults.reduce((s, m) => s + m.taxOwed, 0)
  const totalGain = monthlyResults.reduce((s, m) => s + m.grossGain, 0)
  const totalExempt = exemptMonths.reduce((s, m) => s + m.totalSales, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatório IRPF 2025</h1>
          <p className="text-muted-foreground">
            Ano-calendário 2025 · Ano-base para declaração 2026
          </p>
        </div>
        <Button variant="outline" className="gap-2" disabled>
          <FileDown className="h-4 w-4" />
          Baixar PDF
          <Badge variant="outline" className="text-xs ml-1">Em breve</Badge>
        </Button>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <div className="text-muted-foreground">
          Este relatório é gerado com base no método <strong className="text-foreground">PEPS (FIFO)</strong>,
          conforme instrução normativa da Receita Federal. Use os dados abaixo para preencher sua declaração no
          programa IRPF ou solicite ao seu contador.
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Ganho Total (Bruto)</p>
            <p className={`text-2xl font-bold mt-1 ${totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatBRL(totalGain)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Lucro menos custo de aquisição</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Isento (meses &lt; R$35k)</p>
            <p className="text-2xl font-bold mt-1 text-blue-400">{formatBRL(totalExempt)}</p>
            <p className="text-xs text-muted-foreground mt-1">{exemptMonths.length} mês(es) com isenção</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Imposto Total Devido</p>
            <p className="text-2xl font-bold mt-1 text-amber-400">{formatBRL(totalTax)}</p>
            <p className="text-xs text-muted-foreground mt-1">Via DARF código 4600</p>
          </CardContent>
        </Card>
      </div>

      {/* Section 1: Bens e Direitos */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bens e Direitos — Posição em 31/12/2025</CardTitle>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              Ficha "Bens e Direitos"
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Declare os ativos abaixo na ficha Bens e Direitos do IRPF 2026 com os códigos correspondentes.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Código IRPF</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Quantidade em 31/12</TableHead>
                <TableHead className="text-right">Custo de Aquisição (R$)</TableHead>
                <TableHead className="text-right">Valor de Mercado (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPortfolio2025.map((pos) => (
                <TableRow key={pos.asset} className="border-border/50">
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs border-border/50">
                      {pos.irpfCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold font-mono">{pos.asset}</p>
                      <p className="text-xs text-muted-foreground">{IRPF_CODES[pos.asset] ?? pos.asset}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {pos.amount.toFixed(8)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatBRL(pos.totalBRL)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatBRL(pos.amount * pos.priceBRL)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2: Monthly Gains */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ganho de Capital Mensal — 2025</CardTitle>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              Ficha "Ganhos de Capital"
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Vendas (R$)</TableHead>
                <TableHead className="text-right">Custo (R$)</TableHead>
                <TableHead className="text-right">Ganho Bruto (R$)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Imposto (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyResults.map((m) => (
                <TableRow key={`${m.year}-${m.month}`} className="border-border/50">
                  <TableCell className="font-medium">
                    {MONTH_NAMES[m.month]}/{m.year}
                  </TableCell>
                  <TableCell className="text-right">{formatBRL(m.totalSales)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatBRL(m.totalCost)}</TableCell>
                  <TableCell className={`text-right font-semibold ${m.grossGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatBRL(m.grossGain)}
                  </TableCell>
                  <TableCell>
                    {m.isExempt ? (
                      <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Isento
                      </Badge>
                    ) : m.taxOwed > 0 ? (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Tributável
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border/50 text-muted-foreground text-xs">
                        Sem ganho
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {m.taxOwed > 0 ? (
                      <span className="text-amber-400">{formatBRL(m.taxOwed)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-4 bg-border/50" />

          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Imposto Devido 2025</span>
            <span className="text-xl font-bold text-amber-400">{formatBRL(totalTax)}</span>
          </div>

          {taxableMonths.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">⚠️ Meses tributáveis</p>
              <p>
                Em {taxableMonths.map((m) => `${MONTH_NAMES[m.month]}/${m.year}`).join(', ')}, suas vendas
                ultrapassaram R$35.000. Para cada mês, gere e pague o DARF até o último dia útil do mês seguinte.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Isenções */}
      {exemptMonths.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Isenções Aplicadas
              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs">
                Art. 22, Lei 9.250/95
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Nos meses abaixo, as vendas totais ficaram abaixo de R$35.000 — isentos de DARF.
            </p>
            <div className="flex flex-wrap gap-2">
              {exemptMonths.map((m) => (
                <Badge
                  key={`${m.year}-${m.month}`}
                  variant="outline"
                  className="border-blue-500/30 bg-blue-500/10 text-blue-400"
                >
                  {MONTH_NAMES[m.month]}/{m.year} — {formatBRL(m.totalSales)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
