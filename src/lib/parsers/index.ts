import { ParsedTransaction } from '@/lib/tax-engine/types'
import { parseBinanceCSV } from './binance'
import { parseMercadoBitcoinCSV } from './mercado-bitcoin'
import { parseGenericCSV } from './generic'

export type ExchangeId = 'binance' | 'mercado-bitcoin' | 'foxbit' | 'novadax' | 'bitget' | 'generic'

export interface ExchangeOption {
  id: ExchangeId
  name: string
  logo?: string
  csvFormat?: string
}

export const EXCHANGES: ExchangeOption[] = [
  {
    id: 'binance',
    name: 'Binance',
    csvFormat: 'Date(UTC), Pair, Side, Price, Executed, Amount, Fee',
  },
  {
    id: 'mercado-bitcoin',
    name: 'Mercado Bitcoin',
    csvFormat: 'Data, Tipo, Ativo, Quantidade, Preço, Total, Taxa',
  },
  {
    id: 'foxbit',
    name: 'Foxbit',
    csvFormat: 'Formato genérico aceito',
  },
  {
    id: 'novadax',
    name: 'Novadax',
    csvFormat: 'Formato genérico aceito',
  },
  {
    id: 'bitget',
    name: 'Bitget',
    csvFormat: 'Formato genérico aceito',
  },
  {
    id: 'generic',
    name: 'Genérico',
    csvFormat: 'date, type, asset, amount, price, total, fee',
  },
]

export function parseCSV(exchangeId: ExchangeId, csvContent: string): ParsedTransaction[] {
  switch (exchangeId) {
    case 'binance':
      return parseBinanceCSV(csvContent)
    case 'mercado-bitcoin':
      return parseMercadoBitcoinCSV(csvContent)
    case 'foxbit':
    case 'novadax':
    case 'bitget':
    case 'generic':
    default:
      return parseGenericCSV(csvContent)
  }
}

export { parseBinanceCSV, parseMercadoBitcoinCSV, parseGenericCSV }
