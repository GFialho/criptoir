import Papa from 'papaparse'
import { ParsedTransaction, TransactionType } from '@/lib/tax-engine/types'

interface GenericRow {
  date?: string
  data?: string
  type?: string
  tipo?: string
  asset?: string
  ativo?: string
  amount?: string
  quantidade?: string
  price?: string
  preco?: string
  'preço'?: string
  total?: string
  fee?: string
  taxa?: string
  exchange?: string
}

/**
 * Parser genérico para CSV com colunas padronizadas.
 * Suporta cabeçalhos em inglês e português.
 */
export function parseGenericCSV(csvContent: string): ParsedTransaction[] {
  const result = Papa.parse<GenericRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().trim(),
  })

  const transactions: ParsedTransaction[] = []

  for (const row of result.data) {
    try {
      const dateStr = row.date || row.data || ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) continue

      const typeStr = ((row.type || row.tipo || '') as string).toLowerCase()
      let type: TransactionType = 'buy'
      if (typeStr.includes('sell') || typeStr.includes('venda')) {
        type = 'sell'
      } else if (typeStr.includes('buy') || typeStr.includes('compra')) {
        type = 'buy'
      } else if (typeStr.includes('transfer_in') || typeStr.includes('deposito') || typeStr.includes('depósito')) {
        type = 'transfer_in'
      } else if (typeStr.includes('transfer_out') || typeStr.includes('saque') || typeStr.includes('retirada')) {
        type = 'transfer_out'
      }

      const asset = ((row.asset || row.ativo || '') as string).toUpperCase().trim()
      const amount = parseFloat((row.amount || row.quantidade || '0') as string) || 0
      const priceBRL = parseFloat((row.price || row.preco || row['preço'] || '0') as string) || 0
      const totalBRL = parseFloat((row.total || '0') as string) || (amount * priceBRL)
      const fee = parseFloat((row.fee || row.taxa || '0') as string) || 0
      const exchange = (row.exchange || 'Genérico') as string

      if (!asset || amount <= 0) continue

      transactions.push({
        date,
        type,
        asset,
        amount,
        priceBRL,
        totalBRL,
        fee,
        exchange,
      })
    } catch {
      continue
    }
  }

  return transactions
}
