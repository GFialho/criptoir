import Papa from 'papaparse'
import { ParsedTransaction, TransactionType } from '@/lib/tax-engine/types'

interface MBRow {
  'Data': string
  'Tipo': string
  'Ativo': string
  'Quantidade': string
  'Preço': string
  'Total': string
  'Taxa': string
}

/**
 * Parser para o CSV do Mercado Bitcoin.
 * Formato: Data, Tipo, Ativo, Quantidade, Preço, Total, Taxa
 * Todos os valores já são em BRL.
 */
export function parseMercadoBitcoinCSV(csvContent: string): ParsedTransaction[] {
  const result = Papa.parse<MBRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  const transactions: ParsedTransaction[] = []

  for (const row of result.data) {
    try {
      // Suporta formatos: DD/MM/YYYY HH:mm:ss ou ISO
      const dateStr = row['Data'] || ''
      const date = parseDate(dateStr)
      if (!date || isNaN(date.getTime())) continue

      const tipoStr = (row['Tipo'] || '').toLowerCase()
      let type: TransactionType = 'buy'
      if (tipoStr.includes('compra') || tipoStr === 'buy') {
        type = 'buy'
      } else if (tipoStr.includes('venda') || tipoStr === 'sell') {
        type = 'sell'
      } else if (tipoStr.includes('depósito') || tipoStr.includes('deposito')) {
        type = 'transfer_in'
      } else if (tipoStr.includes('saque') || tipoStr.includes('retirada')) {
        type = 'transfer_out'
      }

      const asset = (row['Ativo'] || '').toUpperCase().trim()
      const amount = parseBRL(row['Quantidade'] || '0')
      const priceBRL = parseBRL(row['Preço'] || '0')
      const totalBRL = parseBRL(row['Total'] || '0')
      const fee = parseBRL(row['Taxa'] || '0')

      if (!asset || amount <= 0) continue

      transactions.push({
        date,
        type,
        asset,
        amount,
        priceBRL,
        totalBRL,
        fee,
        feeCurrency: 'BRL',
        exchange: 'Mercado Bitcoin',
      })
    } catch {
      continue
    }
  }

  return transactions
}

function parseBRL(value: string): number {
  // Remove R$, pontos de milhar, substitui vírgula decimal
  return parseFloat(
    value
      .replace(/R\$\s?/, '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
  ) || 0
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // Tenta ISO primeiro
  const iso = new Date(dateStr)
  if (!isNaN(iso.getTime())) return iso

  // Tenta DD/MM/YYYY HH:mm:ss
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/)
  if (match) {
    const [, day, month, year, hour = '0', min = '0', sec = '0'] = match
    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}`)
  }

  return null
}
