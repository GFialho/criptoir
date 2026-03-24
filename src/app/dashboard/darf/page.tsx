'use client'

import { useState } from 'react'
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
  Receipt,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
  Copy,
  Check,
  Calendar,
  TrendingDown,
  DollarSign,
} from 'lucide-react'
import { mockDARFs } from '@/lib/mock-data'
import { DARF } from '@/lib/tax-engine/types'
import { format, differenceInDays } from 'date-fns'
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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle className="h-3.5 w-3.5" />
        Pago
      </span>
    )
  }
  if (status === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
        <AlertTriangle className="h-3.5 w-3.5" />
        Atrasado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      <Clock className="h-3.5 w-3.5" />
      Pendente
    </span>
  )
}

function DaysUntilDue({ dueDate, status }: { dueDate: Date; status: DARF['status'] }) {
  if (status === 'paid') return null
  const days = differenceInDays(dueDate, new Date())
  if (days < 0) {
    return (
      <p className="text-xs font-semibold text-rose-600">{Math.abs(days)} dias em atraso</p>
    )
  }
  if (days <= 5) {
    return <p className="text-xs font-semibold text-amber-600">Vence em {days} dia{days !== 1 ? 's' : ''}!</p>
  }
  return <p className="text-xs text-slate-400">{days} dias restantes</p>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5 rounded-xl border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-600">Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copiar código
        </>
      )}
    </Button>
  )
}

export default function DARFPage() {
  const [darfs, setDarfs] = useState(mockDARFs)

  const pendingDarfs = darfs.filter((d) => d.status !== 'paid')
  const paidDarfs = darfs.filter((d) => d.status === 'paid')
  const overdueDarfs = darfs.filter((d) => d.status === 'overdue')
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
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">DARFs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Documentos de Arrecadação de Receitas Federais — Código 4600
        </p>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100">
          <Info className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="text-sm text-slate-600">
          O <strong className="text-slate-900">DARF código 4600</strong> é obrigatório para ganhos de capital
          em criptoativos quando as vendas mensais superam R$35.000. O prazo de pagamento é o{' '}
          <strong className="text-slate-900">último dia útil do mês seguinte</strong> às vendas.
        </div>
      </div>

      {/* Overdue alert */}
      {overdueDarfs.length > 0 && (
        <div className="flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <p className="font-semibold text-rose-800">
              {overdueDarfs.length} DARF{overdueDarfs.length > 1 ? 's' : ''} atrasado{overdueDarfs.length > 1 ? 's' : ''}!
            </p>
            <p className="text-sm text-rose-600 mt-0.5">
              Pague o mais breve possível para evitar multas e juros (Selic + 0,33% ao dia).
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-700">Total Pendente</p>
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700">{formatBRL(totalPending)}</p>
          <p className="text-xs text-amber-600 mt-1">{pendingDarfs.length} DARF{pendingDarfs.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">Total Pago em 2025</p>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700">{formatBRL(totalPaid)}</p>
          <p className="text-xs text-emerald-600 mt-1">{paidDarfs.length} DARF{paidDarfs.length !== 1 ? 's' : ''} quitado{paidDarfs.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-slate-500" />
            <p className="text-sm font-medium text-slate-500">Total Imposto 2025</p>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">
            {formatBRL(darfs.reduce((s, d) => s + d.amount, 0))}
          </p>
          <p className="text-xs text-slate-400 mt-1">Somatório do ano</p>
        </div>
      </div>

      {/* DARFs Timeline/Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 p-6">
          <Receipt className="h-5 w-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900">DARFs Gerados — 2025</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Competência</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Código</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vencimento</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pago em</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {darfs.map((darf) => (
                <TableRow
                  key={darf.id}
                  className={`border-slate-100 transition-colors ${
                    darf.status === 'overdue'
                      ? 'bg-rose-50/50 hover:bg-rose-50'
                      : darf.status !== 'paid'
                      ? 'hover:bg-amber-50/50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <TableCell>
                    <div>
                      <p className="font-bold text-slate-900">{darf.competencia}</p>
                      <p className="text-xs text-slate-400">
                        {MONTH_NAMES[darf.month]}/{darf.year}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-600">
                      {darf.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darf.status === 'overdue' ? 'text-rose-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(darf.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </p>
                      <DaysUntilDue dueDate={darf.dueDate} status={darf.status} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono text-slate-900">
                    {formatBRL(darf.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={darf.status} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {darf.paidAt
                      ? format(darf.paidAt, 'dd/MM/yyyy', { locale: ptBR })
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <CopyButton text={`4600 · ${darf.competencia} · ${formatBRL(darf.amount)}`} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-xl border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                        disabled
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                      {darf.status !== 'paid' && (
                        <Button
                          size="sm"
                          className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                          onClick={() => markAsPaid(darf.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Marcar pago
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* How to pay instructions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5">Como pagar o DARF</h2>
        <div className="space-y-4">
          {[
            {
              n: 1,
              icon: TrendingDown,
              color: 'bg-rose-50 text-rose-600',
              title: 'Verifique se há multa',
              desc: 'Se estiver em atraso, acesse o SICALC (Receita Federal) para calcular juros e multas antes de pagar.',
            },
            {
              n: 2,
              icon: Receipt,
              color: 'bg-indigo-50 text-indigo-600',
              title: 'Use o código 4600',
              desc: 'Ganhos de Capital em Renda Variável — selecione este código ao preencher o DARF no site da Receita ou no seu banco.',
            },
            {
              n: 3,
              icon: DollarSign,
              color: 'bg-emerald-50 text-emerald-600',
              title: 'Pague até o vencimento',
              desc: 'Pague em qualquer banco, lotérica ou Internet Banking até o último dia útil do mês seguinte às vendas.',
            },
            {
              n: 4,
              icon: CheckCircle,
              color: 'bg-amber-50 text-amber-600',
              title: 'Guarde o comprovante',
              desc: 'Salve o comprovante de pagamento. Pode ser necessário apresentá-lo na declaração anual.',
            },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-bold">
                {item.n}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
