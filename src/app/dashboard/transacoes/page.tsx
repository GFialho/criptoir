'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUpRight, ArrowDownRight, Search, ArrowUpDown } from 'lucide-react'
import { mockTransactions } from '@/lib/mock-data'
import { Transaction } from '@/lib/tax-engine/types'
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

type SortKey = 'date' | 'asset' | 'type' | 'amount' | 'priceBRL' | 'totalBRL'
type SortDir = 'asc' | 'desc'

const EXCHANGES = ['Todas', ...Array.from(new Set(mockTransactions.map((t) => t.exchange))).sort()]
const ASSETS = ['Todos', ...Array.from(new Set(mockTransactions.map((t) => t.asset))).sort()]

export default function TransacoesPage() {
  const [search, setSearch] = useState('')
  const [exchangeFilter, setExchangeFilter] = useState('Todas')
  const [assetFilter, setAssetFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let txs: Transaction[] = [...mockTransactions]

    if (exchangeFilter !== 'Todas') {
      txs = txs.filter((t) => t.exchange === exchangeFilter)
    }
    if (assetFilter !== 'Todos') {
      txs = txs.filter((t) => t.asset === assetFilter)
    }
    if (typeFilter !== 'Todos') {
      txs = txs.filter((t) => t.type === typeFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      txs = txs.filter(
        (t) =>
          t.asset.toLowerCase().includes(q) ||
          t.exchange.toLowerCase().includes(q) ||
          TYPE_LABELS[t.type]?.toLowerCase().includes(q)
      )
    }

    txs.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'date': av = a.date.getTime(); bv = b.date.getTime(); break
        case 'asset': av = a.asset; bv = b.asset; break
        case 'type': av = a.type; bv = b.type; break
        case 'amount': av = a.amount; bv = b.amount; break
        case 'priceBRL': av = a.priceBRL; bv = b.priceBRL; break
        case 'totalBRL': av = a.totalBRL; bv = b.totalBRL; break
        default: return 0
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return txs
  }, [search, exchangeFilter, assetFilter, typeFilter, sortKey, sortDir])

  const totalVolume = filtered.filter((t) => t.type === 'sell').reduce((s, t) => s + t.totalBRL, 0)
  const totalTxs = filtered.length

  function SortBtn({ col }: { col: SortKey }) {
    return (
      <button
        onClick={() => handleSort(col)}
        className="ml-1 inline-flex items-center opacity-50 hover:opacity-100"
      >
        <ArrowUpDown className="h-3 w-3" />
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">
          {totalTxs} transação{totalTxs !== 1 ? 'ões' : ''} encontrada{totalTxs !== 1 ? 's' : ''}
          {exchangeFilter !== 'Todas' || assetFilter !== 'Todos' || typeFilter !== 'Todos' ? ' (filtrado)' : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total de operações</p>
            <p className="text-2xl font-bold">{totalTxs}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Volume vendido</p>
            <p className="text-2xl font-bold text-red-400">{formatBRL(totalVolume)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Exchanges</p>
            <p className="text-2xl font-bold">
              {new Set(filtered.map((t) => t.exchange)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar ativo, exchange..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-border/50"
              />
            </div>
            <Select value={exchangeFilter} onValueChange={(v) => setExchangeFilter(v ?? 'Todas')}>
              <SelectTrigger className="w-[180px] bg-background border-border/50">
                <SelectValue placeholder="Exchange" />
              </SelectTrigger>
              <SelectContent>
                {EXCHANGES.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assetFilter} onValueChange={(v) => setAssetFilter(v ?? 'Todos')}>
              <SelectTrigger className="w-[150px] bg-background border-border/50">
                <SelectValue placeholder="Ativo" />
              </SelectTrigger>
              <SelectContent>
                {ASSETS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'Todos')}>
              <SelectTrigger className="w-[160px] bg-background border-border/50">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os tipos</SelectItem>
                <SelectItem value="buy">Compra</SelectItem>
                <SelectItem value="sell">Venda</SelectItem>
                <SelectItem value="transfer_in">Depósito</SelectItem>
                <SelectItem value="transfer_out">Retirada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>
                    Data <SortBtn col="date" />
                  </TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead>
                    Tipo <SortBtn col="type" />
                  </TableHead>
                  <TableHead>
                    Ativo <SortBtn col="asset" />
                  </TableHead>
                  <TableHead className="text-right">
                    Quantidade <SortBtn col="amount" />
                  </TableHead>
                  <TableHead className="text-right">
                    Preço (R$) <SortBtn col="priceBRL" />
                  </TableHead>
                  <TableHead className="text-right">
                    Total (R$) <SortBtn col="totalBRL" />
                  </TableHead>
                  <TableHead className="text-right">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => (
                  <TableRow key={tx.id} className="border-border/50">
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(tx.date, 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm">{tx.exchange}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {tx.type === 'sell' || tx.type === 'transfer_out' ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        <span
                          className={`text-sm ${
                            tx.type === 'sell' || tx.type === 'transfer_out'
                              ? 'text-red-400'
                              : 'text-emerald-400'
                          }`}
                        >
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
                      {tx.amount.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatBRL(tx.priceBRL)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      <span
                        className={
                          tx.type === 'sell' || tx.type === 'transfer_out'
                            ? 'text-red-400'
                            : 'text-emerald-400'
                        }
                      >
                        {tx.type === 'sell' || tx.type === 'transfer_out' ? '-' : '+'}
                        {formatBRL(tx.totalBRL)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {tx.fee > 0 ? formatBRL(tx.fee) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
              <p>Nenhuma transação encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
