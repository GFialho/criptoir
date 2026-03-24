'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
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
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ArrowUpDown,
  Download,
  TrendingDown,
  BarChart2,
  Layers,
  X,
} from 'lucide-react'
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

const ASSET_COLORS: Record<string, string> = {
  BTC: 'bg-amber-100 text-amber-700',
  ETH: 'bg-indigo-100 text-indigo-700',
  SOL: 'bg-violet-100 text-violet-700',
  USDT: 'bg-emerald-100 text-emerald-700',
}

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

type SortKey = 'date' | 'asset' | 'type' | 'amount' | 'priceBRL' | 'totalBRL'
type SortDir = 'asc' | 'desc'

const EXCHANGES = ['Todas', ...Array.from(new Set(mockTransactions.map((t) => t.exchange))).sort()]
const ASSETS = ['Todos', ...Array.from(new Set(mockTransactions.map((t) => t.asset))).sort()]

const PAGE_SIZE = 20

export default function TransacoesPage() {
  const [search, setSearch] = useState('')
  const [exchangeFilter, setExchangeFilter] = useState('Todas')
  const [assetFilter, setAssetFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  const hasFilters =
    exchangeFilter !== 'Todas' || assetFilter !== 'Todos' || typeFilter !== 'Todos' || search

  const clearFilters = () => {
    setSearch('')
    setExchangeFilter('Todas')
    setAssetFilter('Todos')
    setTypeFilter('Todos')
    setPage(1)
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalVolume = filtered.filter((t) => t.type === 'sell').reduce((s, t) => s + t.totalBRL, 0)
  const totalBuys = filtered.filter((t) => t.type === 'buy').reduce((s, t) => s + t.totalBRL, 0)
  const totalTxs = filtered.length

  function SortBtn({ col }: { col: SortKey }) {
    const active = sortKey === col
    return (
      <button
        onClick={() => handleSort(col)}
        className={`ml-1 inline-flex items-center ${active ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
      >
        <ArrowUpDown className="h-3 w-3" />
      </button>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transações</h1>
          <p className="text-slate-500 text-sm mt-1">
            {totalTxs} transaç{totalTxs !== 1 ? 'ões' : 'ão'} encontrada{totalTxs !== 1 ? 's' : ''}
            {hasFilters && <span className="ml-1 text-indigo-600 font-medium">(filtrado)</span>}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          disabled
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
              <Layers className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-sm text-slate-500">Total de operações</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalTxs}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
              <TrendingDown className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-sm text-rose-600">Volume vendido</p>
          </div>
          <p className="text-2xl font-bold text-rose-700 font-mono">{formatBRL(totalVolume)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <BarChart2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-600">Volume comprado</p>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono">{formatBRL(totalBuys)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar ativo, exchange..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
          <Select value={exchangeFilter} onValueChange={(v) => { setExchangeFilter(v ?? 'Todas'); setPage(1) }}>
            <SelectTrigger className="w-[180px] rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Exchange" />
            </SelectTrigger>
            <SelectContent>
              {EXCHANGES.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assetFilter} onValueChange={(v) => { setAssetFilter(v ?? 'Todos'); setPage(1) }}>
            <SelectTrigger className="w-[140px] rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Ativo" />
            </SelectTrigger>
            <SelectContent>
              {ASSETS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v ?? 'Todos'); setPage(1) }}>
            <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-slate-50">
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
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Histórico de Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Data <SortBtn col="date" />
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Exchange</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Tipo <SortBtn col="type" />
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ativo <SortBtn col="asset" />
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Qtd <SortBtn col="amount" />
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Preço <SortBtn col="priceBRL" />
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total <SortBtn col="totalBRL" />
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Taxa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((tx) => (
                <TableRow key={tx.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                    {format(tx.date, 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700">{tx.exchange}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        tx.type === 'sell' || tx.type === 'transfer_out'
                          ? 'bg-rose-100 text-rose-700'
                          : tx.type === 'buy'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tx.type === 'sell' || tx.type === 'transfer_out' ? (
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
                    {tx.amount.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-600">
                    {formatBRL(tx.priceBRL)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold font-mono">
                    <span
                      className={
                        tx.type === 'sell' || tx.type === 'transfer_out'
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }
                    >
                      {tx.type === 'sell' || tx.type === 'transfer_out' ? '-' : '+'}
                      {formatBRL(tx.totalBRL)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-400 font-mono">
                    {tx.fee > 0 ? formatBRL(tx.fee) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-8 w-8" />
            </div>
            <p className="font-semibold text-slate-500">Nenhuma transação encontrada</p>
            <p className="text-sm">Tente ajustar os filtros ou limpar a busca</p>
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-2 rounded-xl"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border-slate-200"
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-500 px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border-slate-200"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
