import { Transaction, AssetPosition, CostBasisLot } from './types'

/**
 * PEPS - Primeiro que Entra, Primeiro que Sai (FIFO)
 * Método padrão aceito pela Receita Federal para criptoativos.
 */
export function buildPositionsPEPS(transactions: Transaction[]): Map<string, AssetPosition> {
  const positions = new Map<string, AssetPosition>()

  // Ordenar por data (mais antiga primeiro)
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime())

  for (const tx of sorted) {
    if (tx.type === 'buy' || tx.type === 'transfer_in' || tx.type === 'staking' || tx.type === 'airdrop') {
      addToPosition(positions, tx)
    } else if (tx.type === 'sell' || tx.type === 'transfer_out') {
      removeFromPosition(positions, tx)
    }
  }

  return positions
}

function addToPosition(positions: Map<string, AssetPosition>, tx: Transaction): void {
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

function removeFromPosition(positions: Map<string, AssetPosition>, tx: Transaction): void {
  const position = positions.get(tx.asset)
  if (!position) return

  let remaining = tx.amount

  // FIFO: consumir os lotes mais antigos primeiro
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

/**
 * Calcula o custo de base para uma venda usando PEPS.
 * Retorna o custo total dos lotes consumidos.
 */
export function getCostBasisForSale(
  lots: CostBasisLot[],
  amountSold: number
): { costBasis: number; lotsConsumed: CostBasisLot[] } {
  let remaining = amountSold
  let costBasis = 0
  const lotsConsumed: CostBasisLot[] = []

  const sortedLots = [...lots].sort((a, b) => a.date.getTime() - b.date.getTime())

  for (const lot of sortedLots) {
    if (remaining <= 0) break

    if (lot.amount <= remaining) {
      costBasis += lot.totalCost
      lotsConsumed.push({ ...lot })
      remaining -= lot.amount
    } else {
      const fraction = remaining / lot.amount
      costBasis += lot.totalCost * fraction
      lotsConsumed.push({
        ...lot,
        amount: remaining,
        totalCost: lot.totalCost * fraction,
      })
      remaining = 0
    }
  }

  return { costBasis, lotsConsumed }
}
