import { Transaction, MonthlyGainResult, AssetPosition, CostBasisLot } from './types'
import { getCostBasisForSale } from './peps'

// Isenção: vendas totais no mês <= R$35.000
const EXEMPTION_THRESHOLD = 35000

// Alíquotas progressivas sobre ganho de capital
// Receita Federal - Lei 13.259/2016
const TAX_BRACKETS = [
  { limit: 5_000_000, rate: 0.15 },
  { limit: 10_000_000, rate: 0.175 },
  { limit: 30_000_000, rate: 0.20 },
  { limit: Infinity, rate: 0.225 },
]

export function calculateProgressiveTax(gain: number): number {
  if (gain <= 0) return 0

  let tax = 0
  let prev = 0

  for (const bracket of TAX_BRACKETS) {
    const slice = Math.min(gain - prev, bracket.limit - prev)
    if (slice <= 0) break
    tax += slice * bracket.rate
    prev = bracket.limit
    if (gain <= bracket.limit) break
  }

  return tax
}

export function calculateMonthlyGains(
  transactions: Transaction[],
  positionsBeforeMonth: Map<string, AssetPosition>
): MonthlyGainResult[] {
  // Agrupar transações por ano/mês
  const byMonth = new Map<string, Transaction[]>()

  for (const tx of transactions) {
    const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth.has(key)) byMonth.set(key, [])
    byMonth.get(key)!.push(tx)
  }

  // Fazer uma cópia mutável das posições para calcular os custos de base
  const workingPositions = deepClonePositions(positionsBeforeMonth)
  const results: MonthlyGainResult[] = []

  // Processar meses em ordem cronológica
  const sortedKeys = [...byMonth.keys()].sort()

  for (const key of sortedKeys) {
    const [yearStr, monthStr] = key.split('-')
    const year = parseInt(yearStr)
    const month = parseInt(monthStr)
    const monthTxs = byMonth.get(key)!

    // Primeiro, processar compras do mês (adicionar às posições)
    const buys = monthTxs.filter(tx =>
      tx.type === 'buy' || tx.type === 'transfer_in' || tx.type === 'staking' || tx.type === 'airdrop'
    )
    for (const buy of buys.sort((a, b) => a.date.getTime() - b.date.getTime())) {
      applyBuyToPositions(workingPositions, buy)
    }

    // Calcular ganho nas vendas
    const sells = monthTxs.filter(tx => tx.type === 'sell' || tx.type === 'transfer_out')
    let totalSales = 0
    let totalCostBasis = 0

    for (const sell of sells.sort((a, b) => a.date.getTime() - b.date.getTime())) {
      totalSales += sell.totalBRL

      const position = workingPositions.get(sell.asset)
      if (position && position.lots.length > 0) {
        const { costBasis } = getCostBasisForSale(position.lots, sell.amount)
        totalCostBasis += costBasis
        // Aplicar a venda às posições
        applySellToPositions(workingPositions, sell)
      } else {
        // Sem custo de base registrado — custo zero (edge case)
        totalCostBasis += 0
      }
    }

    const grossGain = totalSales - totalCostBasis
    const isExempt = totalSales <= EXEMPTION_THRESHOLD
    const taxableGain = isExempt ? 0 : Math.max(0, grossGain)
    const taxOwed = calculateProgressiveTax(taxableGain)

    // Taxa efetiva (para exibição)
    const taxRate = taxableGain > 0 ? taxOwed / taxableGain : 0

    results.push({
      year,
      month,
      totalSales,
      totalCost: totalCostBasis,
      grossGain,
      isExempt,
      taxableGain,
      taxRate,
      taxOwed,
      transactions: monthTxs,
    })
  }

  return results
}

function applyBuyToPositions(positions: Map<string, AssetPosition>, tx: Transaction): void {
  const existing = positions.get(tx.asset)
  const costPerUnit = tx.amount > 0 ? tx.totalBRL / tx.amount : 0

  const newLot: CostBasisLot = {
    date: tx.date,
    amount: tx.amount,
    costPerUnit,
    totalCost: tx.totalBRL,
    exchange: tx.exchange,
  }

  if (!existing) {
    positions.set(tx.asset, {
      asset: tx.asset,
      totalAmount: tx.amount,
      averageCost: costPerUnit,
      totalCost: tx.totalBRL,
      lots: [newLot],
    })
  } else {
    existing.lots.push(newLot)
    existing.totalAmount += tx.amount
    existing.totalCost += tx.totalBRL
    existing.averageCost = existing.totalAmount > 0 ? existing.totalCost / existing.totalAmount : 0
  }
}

function applySellToPositions(positions: Map<string, AssetPosition>, tx: Transaction): void {
  const position = positions.get(tx.asset)
  if (!position) return

  let remaining = tx.amount

  while (remaining > 0 && position.lots.length > 0) {
    const lot = position.lots[0]

    if (lot.amount <= remaining) {
      remaining -= lot.amount
      position.totalAmount -= lot.amount
      position.totalCost -= lot.totalCost
      position.lots.shift()
    } else {
      const fraction = remaining / lot.amount
      const costConsumed = lot.totalCost * fraction
      lot.amount -= remaining
      lot.totalCost -= costConsumed
      position.totalAmount -= remaining
      position.totalCost -= costConsumed
      remaining = 0
    }
  }

  position.averageCost = position.totalAmount > 0 ? position.totalCost / position.totalAmount : 0

  if (position.totalAmount <= 0) {
    positions.delete(tx.asset)
  }
}

function deepClonePositions(positions: Map<string, AssetPosition>): Map<string, AssetPosition> {
  const clone = new Map<string, AssetPosition>()
  for (const [key, pos] of positions.entries()) {
    clone.set(key, {
      ...pos,
      lots: pos.lots.map(lot => ({ ...lot })),
    })
  }
  return clone
}
