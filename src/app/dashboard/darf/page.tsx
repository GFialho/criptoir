'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Receipt,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
} from 'lucide-react'
import { mockDARFs } from '@/lib/mock-data'
import { DARF } from '@/lib/tax-engine/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const MONTH_NAMES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function StatusBadge({ status }: { status: DARF['status'] }) {
  if (status === 'paid') {
    return (
      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1">
        <CheckCircle className="h-3 w-3" />
        Pago
      </Badge>
    )
  }
  if (status === 'overdue') {
    return (
      <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 gap-1">
        <AlertTriangle className="h-3 w-3" />
        Atrasado
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 gap-1">
      <Clock className="h-3 w-3" />
      Pendente
    </Badge>
  )
}

export default function DARFPage() {
  const [darfs, setDarfs] = useState(mockDARFs)

  const pendingDarfs = darfs.filter((d) => d.status !== 'paid')
  const paidDarfs = darfs.filter((d) => d.status === 'paid')
  const totalPending = pendingDarfs.reduce((s, d) => s + d.amount, 0)
  const totalPaid = paidDarfs.reduce((s, d) => s + d.amount, 0)

  function markAsPaid(id: string) {
    setDarfs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'paid' as const, paidAt: new Date() } : d
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">DARFs</h1>
        <p className="text-muted-foreground">
          Documentos de Arrecadação de Receitas Federais — Código 4600
        </p>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <div className="text-muted-foreground">
          O <strong className="text-foreground">DARF código 4600</strong> é obrigatório para ganhos de capital
          em criptoativos quando as vendas mensais superam R$35.000. O prazo de pagamento é o{' '}
          <strong className="text-foreground">último dia útil do mês seguinte</strong> às vendas.
        </div>
      </div>

      {/* Alerts */}
      {pendingDarfs.filter((d) => d.status === 'overdue').length > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-muted-foreground">
            Você tem{' '}
            <strong className="text-red-400">
              {pendingDarfs.filter((d) => d.status === 'overdue').length} DARF(s) atrasado(s)
            </strong>
            . Pague o mais breve possível para evitar multas e juros (Selic + 0,33% ao dia).
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Pendente</p>
            <p className="text-2xl font-bold mt-1 text-amber-400">{formatBRL(totalPending)}</p>
            <p className="text-xs text-muted-foreground mt-1">{pendingDarfs.length} DARF(s)</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Pago em 2025</p>
            <p className="text-2xl font-bold mt-1 text-emerald-400">{formatBRL(totalPaid)}</p>
            <p className="text-xs text-muted-foreground mt-1">{paidDarfs.length} DARF(s) quitado(s)</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Imposto 2025</p>
            <p className="text-2xl font-bold mt-1">
              {formatBRL(darfs.reduce((s, d) => s + d.amount, 0))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Somatório do ano</p>
          </CardContent>
        </Card>
      </div>

      {/* DARFs Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            DARFs Gerados — 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Competência</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pago em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {darfs.map((darf) => (
                <TableRow key={darf.id} className="border-border/50">
                  <TableCell>
                    <div>
                      <p className="font-semibold">{darf.competencia}</p>
                      <p className="text-xs text-muted-foreground">
                        {MONTH_NAMES[darf.month]}/{darf.year}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs border-border/50">
                      {darf.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${
                        darf.status === 'overdue' ? 'text-red-400 font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {format(darf.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatBRL(darf.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={darf.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {darf.paidAt
                      ? format(darf.paidAt, 'dd/MM/yyyy', { locale: ptBR })
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled
                      >
                        <FileDown className="h-3 w-3" />
                        PDF
                      </Button>
                      {darf.status !== 'paid' && (
                        <Button
                          size="sm"
                          className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => markAsPaid(darf.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                          Marcar pago
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Como pagar o DARF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
            <p>Acesse o site da Receita Federal ou seu banco e abra o SICALC (Sistema de Cálculo de Acréscimos Legais) para calcular juros se estiver em atraso.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
            <p>Use o <strong className="text-foreground">código 4600</strong> (Ganhos de Capital — Renda Variável) ao preencher o DARF.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
            <p>Pague em qualquer banco, lotérica ou pelo Internet Banking até o vencimento. Atraso incorre em multa de 0,33% ao dia + Selic.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
            <p>Guarde o comprovante de pagamento. Você pode precisar apresentá-lo na sua declaração anual.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
