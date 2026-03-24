'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

const STEPS = ['Selecionar Exchange', 'Upload CSV', 'Pré-visualizar', 'Confirmar']

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
    // Em produção: salvar no banco de dados
    setImported(true)
    setStep(3)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Importar Transações</h1>
        <p className="text-muted-foreground">
          Importe o histórico de operações da sua exchange favorita
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-primary text-primary-foreground'
                  : i === step
                  ? 'border-2 border-primary text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`hidden text-sm sm:block ${
                i === step ? 'font-medium text-foreground' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground/50" />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Select Exchange */}
      {step === 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Selecione sua Exchange</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExchange(ex.id)}
                  className={`rounded-xl border p-4 text-left transition-all hover:border-primary/50 ${
                    selectedExchange === ex.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/50 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ex.name}</span>
                    {selectedExchange === ex.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  {ex.csvFormat && (
                    <p className="mt-1 text-xs text-muted-foreground font-mono truncate">{ex.csvFormat}</p>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                disabled={!selectedExchange}
                onClick={() => setStep(1)}
                className="gap-2 bg-primary text-primary-foreground"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Upload CSV */}
      {step === 1 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Upload do CSV
              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 hover:border-primary/50 hover:bg-muted/20'
              }`}
            >
              <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="mb-1 font-medium">Arraste o arquivo CSV aqui</p>
              <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
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
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{fileName}</span>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pré-visualização — {transactions.length} transações</span>
              <Badge className="bg-primary/10 text-primary border-primary/30">
                {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Preço (R$)</TableHead>
                    <TableHead className="text-right">Total (R$)</TableHead>
                    <TableHead className="text-right">Taxa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 20).map((tx, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(tx.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            tx.type === 'sell'
                              ? 'border-red-500/30 text-red-400'
                              : 'border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {TYPE_LABELS[tx.type] ?? tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{tx.asset}</span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono">
                        {tx.amount.toFixed(6)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatBRL(tx.priceBRL)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">
                        {formatBRL(tx.totalBRL)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {tx.fee.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {transactions.length > 20 && (
              <p className="text-center text-sm text-muted-foreground">
                Mostrando 20 de {transactions.length} transações
              </p>
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={handleConfirm} className="gap-2 bg-primary text-primary-foreground">
                Confirmar Importação
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmed */}
      {step === 3 && imported && (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">Importação concluída!</h2>
            <p className="text-center text-muted-foreground">
              <strong className="text-foreground">{transactions.length} transações</strong> importadas
              com sucesso da <strong className="text-foreground">
                {EXCHANGES.find((e) => e.id === selectedExchange)?.name}
              </strong>.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0)
                  setSelectedExchange(null)
                  setFileName(null)
                  setTransactions([])
                  setImported(false)
                }}
              >
                Importar mais
              </Button>
              <a href="/dashboard/transacoes">
                <Button className="bg-primary text-primary-foreground">
                  Ver transações
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
