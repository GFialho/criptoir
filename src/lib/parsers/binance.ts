import Papa from 'papaparse'
import { ParsedTransaction, TransactionType } from '@/lib/tax-engine/types'

interface BinanceRow {
  'Date(UTC)': string
  'Pair': string
  'Side': string
  'Price': string
  'Executed': string
  'Amount': string
  'Fee': string
}

/**
 * Parser para o CSV de histórico de ordens da Binance.
 * Formato: Date(UTC), Pair, Side, Price, Executed, Amount, Fee
 *
 * Nota: Os valores de Amount são em moeda de cotação (ex: USDT, BRL).
 * Para conversão BRL usamos preço × quantidade executada.
 */
export function parseBinanceCSV(csvContent: string): ParsedTransaction[] {
  const result = Papa.parse<BinanceRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  const transactions: ParsedTransaction[] = []

  for (const row of result.data) {
    try {
      const date = new Date(row['Date(UTC)'])
      if (isNaN(date.getTime())) continue

      const side = row['Side']?.toUpperCase()
      const type: TransactionType = side === 'BUY' ? 'buy' : side === 'SELL' ? 'sell' : 'buy'

      const pair = row['Pair'] || ''
      // Extrair o ativo base do par (ex: BTCUSDT → BTC, ETHBRL → ETH)
      const asset = extractBaseAsset(pair)

      // Quantidade executada (ex: "0.001BTC")
      const executedStr = row['Executed'] || '0'
      const amount = parseFloat(executedStr.replace(/[^0-9.]/g, '')) || 0

      // Total (ex: "500.00USDT" ou "500.00BRL")
      const amountStr = row['Amount'] || '0'
      const totalQuote = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0

      // Preço por unidade
      const price = parseFloat(row['Price'] || '0') || 0

      // Fee (ex: "0.00050BTC")
      const feeStr = row['Fee'] || '0'
      const fee = parseFloat(feeStr.replace(/[^0-9.]/g, '')) || 0
      const feeCurrency = feeStr.replace(/[0-9.]/g, '').trim()

      // Detectar se é par BRL ou USDT
      // Se USDT, precisaria de cotação histórica — por ora, usar como aproximação
      const isQuoteBRL = pair.endsWith('BRL')
      const totalBRL = isQuoteBRL ? totalQuote : totalQuote * 5.5 // fallback: USD→BRL ~5.5

      transactions.push({
        date,
        type,
        asset,
        amount,
        priceBRL: isQuoteBRL ? price : price * 5.5,
        totalBRL,
        fee,
        feeCurrency: feeCurrency || undefined,
        exchange: 'Binance',
      })
    } catch {
      // Ignorar linhas inválidas
      continue
    }
  }

  return transactions
}

function extractBaseAsset(pair: string): string {
  // Remover sufixos comuns de moeda de cotação
  const quotes = ['USDT', 'BUSD', 'USDC', 'BRL', 'BTC', 'ETH', 'BNB']
  for (const quote of quotes) {
    if (pair.endsWith(quote) && pair.length > quote.length) {
      return pair.slice(0, pair.length - quote.length)
    }
  }
  return pair
}
