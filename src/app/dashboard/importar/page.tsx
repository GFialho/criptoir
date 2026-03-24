'use client'

import { useState, useCallback } from 'react'
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
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react'
import { EXCHANGES, ExchangeId, parseCSV } from '@/lib/parsers'
import { ParsedTransaction } from '@/lib/tax-engine/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const TYPE_LABELS: Record<string, string> = {
  buy: 'Compra',
  sell: 'Venda',
  transfer_in: 'Depósito',
  transfer_out: 'Retirada',
  fee: 'Taxa',
  staking: 'Staking',
  airdrop: 'Airdrop',
}

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const STEPS = [
  { label: 'Selecionar Exchange', desc: 'Escolha de onde importar' },
  { label: 'Upload do CSV', desc: 'Envie o arquivo exportado' },
  { label: 'Pré-visualizar', desc: 'Confira os dados' },
  { label: 'Concluído', desc: 'Importação finalizada' },
]

// Exchange color/icon mapping
const EXCHANGE_META: Record<string, { color: string; letter: string }> = {
  binance: { color: 'bg-amber-100 text-amber-700 border-amber-200', letter: 'B' },
  mercadobitcoin: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', letter: 'MB' },
  foxbit: { color: 'bg-orange-100 text-orange-700 border-orange-200', letter: 'F' },
  novadax: { color: 'bg-violet-100 text-violet-700 border-violet-200', letter: 'N' },
  bitget: { color: 'bg-cyan-100 text-cyan-700 border-cyan-200', letter: 'BG' },
  generic: { color: 'bg-slate-100 text-slate-700 border-slate-200', letter: 'G' },
}

export default function ImportarPage() {
  const [step, setStep] = useState(0)
  const [selectedExchange, setSelectedExchange] = useState<ExchangeId | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imported, setImported] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!selectedExchange) return
      setError(null)
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const parsed = parseCSV(selectedExchange, content)
          if (parsed.length === 0) {
            setError('Nenhuma transação encontrada. Verifique se o arquivo está no formato correto.')
            return
          }
          setTransactions(parsed)
          setStep(2)
        } catch (err) {
          setError('Erro ao processar o arquivo. Verifique o formato e tente novamente.')
          console.error(err)
        }
      }
      reader.readAsText(file, 'UTF-8')
    },
    [selectedExchange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleConfirm = () => {
    setImported(true)
    setStep(3)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Importar Transações</h1>
        <p className="text-slate-500 mt-1">
          Importe o histórico de operações da sua exchange favorita
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i < step
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : i === step
                    ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-semibold ${i === step ? 'text-slate-900' : i < step ? 'text-slate-600' : 'text-slate-400'}`}>
                  {s.label}
                </p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 mx-3 h-0.5 rounded-full ${i < step ? 'bg-emerald-300' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Select Exchange */}
      {step === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Selecione sua Exchange</h2>
          <p className="text-sm text-slate-500 mb-6">
            Cada exchange tem um formato de CSV diferente. Selecione corretamente para garantir a precisão dos dados.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXCHANGES.map((ex) => {
              const meta = EXCHANGE_META[ex.id] ?? { color: 'bg-slate-100 text-slate-700 border-slate-200', letter: ex.name[0] }
              return (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExchange(ex.id)}
                  className={`relative rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md ${
                    selectedExchange === ex.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold ${meta.color}`}>
                        {meta.letter}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{ex.name}</p>
                        {ex.csvFormat && (
                          <p className="mt-0.5 text-xs text-slate-400 font-mono truncate max-w-[120px]">{ex.csvFormat}</p>
                        )}
                      </div>
                    </div>
                    {selectedExchange === ex.id && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              disabled={!selectedExchange}
              onClick={() => setStep(1)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 disabled:opacity-40"
            >
              Próximo passo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Upload CSV */}
      {step === 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-slate-900">Upload do arquivo CSV</h2>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
            </span>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
          >
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}`}>
              <Upload className={`h-8 w-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
            <p className="mb-1 text-lg font-semibold text-slate-700">
              {isDragging ? 'Solte o arquivo aqui!' : 'Arraste o arquivo CSV aqui'}
            </p>
            <p className="text-sm text-slate-400">ou <span className="text-indigo-600 font-medium">clique para selecionar</span></p>
            <p className="mt-3 text-xs text-slate-400">Apenas arquivos .csv são aceitos</p>
            <input
              type="file"
              accept=".csv"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>

          {fileName && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                <FileText className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800 text-sm">{fileName}</p>
                <p className="text-xs text-emerald-600">Arquivo carregado com sucesso</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pré-visualização
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{transactions.length} transações</span> encontradas de{' '}
                <span className="font-semibold text-indigo-600">
                  {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ativo</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantidade</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Preço (R$)</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total (R$)</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 20).map((tx, i) => (
                  <TableRow
                    key={i}
                    className={`border-slate-100 transition-colors ${i < 3 ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'}`}
                  >
                    <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                      {format(tx.date, 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tx.type === 'sell'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {TYPE_LABELS[tx.type] ?? tx.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-bold text-slate-700">{tx.asset}</span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono text-slate-700">
                      {tx.amount.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-700">
                      {formatBRL(tx.priceBRL)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-slate-900">
                      {formatBRL(tx.totalBRL)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-400">
                      {tx.fee.toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {transactions.length > 20 && (
            <div className="border-t border-slate-100 bg-slate-50 p-4 text-center text-sm text-slate-500">
              Mostrando 20 de <strong>{transactions.length}</strong> transações — todas serão importadas
            </div>
          )}

          <div className="flex justify-between border-t border-slate-100 p-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleConfirm}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6"
            >
              Confirmar Importação
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && imported && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-16 shadow-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Sparkles className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Importação concluída!</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            <strong className="text-slate-900">{transactions.length} transações</strong> importadas
            com sucesso da{' '}
            <strong className="text-indigo-600">
              {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
            </strong>.
            {' '}O motor fiscal PEPS já está calculando seus ganhos.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setStep(0)
                setSelectedExchange(null)
                setFileName(null)
                setTransactions([])
                setImported(false)
              }}
              className="rounded-xl border-slate-200 gap-2"
            >
              <Upload className="h-4 w-4" />
              Importar mais
            </Button>
            <a href="/dashboard/transacoes">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2">
                <FileText className="h-4 w-4" />
                Ver transações
              </Button>
            </a>
            <a href="/dashboard/relatorio">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
                <CheckCircle className="h-4 w-4" />
                Ver relatório IRPF
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
