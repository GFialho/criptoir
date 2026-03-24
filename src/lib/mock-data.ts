import { Transaction } from '@/lib/tax-engine/types'

// Cotações aproximadas (BRL) usadas na geração do mock
const PRICES_2025: Record<string, Record<number, number>> = {
  BTC: {
    1: 460000, 2: 510000, 3: 490000, 4: 520000, 5: 480000, 6: 550000,
    7: 590000, 8: 620000, 9: 600000, 10: 650000, 11: 680000, 12: 720000,
  },
  ETH: {
    1: 14000, 2: 15500, 3: 14800, 4: 16000, 5: 15200, 6: 17000,
    7: 18500, 8: 19000, 9: 18200, 10: 20000, 11: 21500, 12: 22000,
  },
  SOL: {
    1: 800, 2: 900, 3: 850, 4: 950, 5: 880, 6: 1000,
    7: 1100, 8: 1200, 9: 1150, 10: 1300, 11: 1400, 12: 1500,
  },
  USDT: {
    1: 5.7, 2: 5.8, 3: 5.75, 4: 5.9, 5: 5.85, 6: 5.95,
    7: 6.0, 8: 6.1, 9: 6.05, 10: 6.15, 11: 6.2, 12: 6.25,
  },
}

function price(asset: string, month: number): number {
  return PRICES_2025[asset]?.[month] ?? 1
}

let idCounter = 1
function makeId(): string {
  return `tx-${String(idCounter++).padStart(4, '0')}`
}

export const mockTransactions: Transaction[] = [
  // ────────────────────────────────────────────────────────────
  // Janeiro 2025 — Compras iniciais (mês abaixo de R$35k)
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-01-05'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.05,
    priceBRL: price('BTC', 1), totalBRL: 0.05 * price('BTC', 1), fee: 23,
  },
  {
    id: makeId(), date: new Date('2025-01-10'), exchange: 'Mercado Bitcoin',
    type: 'buy', asset: 'ETH', amount: 1.5,
    priceBRL: price('ETH', 1), totalBRL: 1.5 * price('ETH', 1), fee: 42,
  },
  {
    id: makeId(), date: new Date('2025-01-15'), exchange: 'Binance',
    type: 'buy', asset: 'SOL', amount: 20,
    priceBRL: price('SOL', 1), totalBRL: 20 * price('SOL', 1), fee: 16,
  },
  {
    id: makeId(), date: new Date('2025-01-20'), exchange: 'Binance',
    type: 'buy', asset: 'USDT', amount: 5000,
    priceBRL: price('USDT', 1), totalBRL: 5000 * price('USDT', 1), fee: 5,
  },
  // Pequena venda — abaixo de R$35k (isento)
  {
    id: makeId(), date: new Date('2025-01-28'), exchange: 'Mercado Bitcoin',
    type: 'sell', asset: 'ETH', amount: 0.3,
    priceBRL: price('ETH', 1), totalBRL: 0.3 * price('ETH', 1), fee: 12,
  },

  // ────────────────────────────────────────────────────────────
  // Fevereiro 2025 — Compras + venda menor que 35k (isento)
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-02-03'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.04,
    priceBRL: price('BTC', 2), totalBRL: 0.04 * price('BTC', 2), fee: 20,
  },
  {
    id: makeId(), date: new Date('2025-02-14'), exchange: 'Binance',
    type: 'buy', asset: 'SOL', amount: 15,
    priceBRL: price('SOL', 2), totalBRL: 15 * price('SOL', 2), fee: 13.5,
  },
  {
    id: makeId(), date: new Date('2025-02-20'), exchange: 'Foxbit',
    type: 'sell', asset: 'SOL', amount: 5,
    priceBRL: price('SOL', 2), totalBRL: 5 * price('SOL', 2), fee: 4.5,
  },

  // ────────────────────────────────────────────────────────────
  // Março 2025 — Mês TRIBUTÁVEL (vendas > R$35k)
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-03-05'), exchange: 'Binance',
    type: 'buy', asset: 'ETH', amount: 2,
    priceBRL: price('ETH', 3), totalBRL: 2 * price('ETH', 3), fee: 59.2,
  },
  {
    id: makeId(), date: new Date('2025-03-10'), exchange: 'Binance',
    type: 'sell', asset: 'BTC', amount: 0.08,
    priceBRL: price('BTC', 3), totalBRL: 0.08 * price('BTC', 3), fee: 39.2,
  },
  {
    id: makeId(), date: new Date('2025-03-15'), exchange: 'Mercado Bitcoin',
    type: 'sell', asset: 'ETH', amount: 1,
    priceBRL: price('ETH', 3), totalBRL: 1 * price('ETH', 3), fee: 44.4,
  },
  {
    id: makeId(), date: new Date('2025-03-22'), exchange: 'Binance',
    type: 'sell', asset: 'SOL', amount: 10,
    priceBRL: price('SOL', 3), totalBRL: 10 * price('SOL', 3), fee: 8.5,
  },

  // ────────────────────────────────────────────────────────────
  // Abril 2025
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-04-08'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.03,
    priceBRL: price('BTC', 4), totalBRL: 0.03 * price('BTC', 4), fee: 15.6,
  },
  {
    id: makeId(), date: new Date('2025-04-18'), exchange: 'Novadax',
    type: 'buy', asset: 'SOL', amount: 30,
    priceBRL: price('SOL', 4), totalBRL: 30 * price('SOL', 4), fee: 28.5,
  },
  {
    id: makeId(), date: new Date('2025-04-25'), exchange: 'Binance',
    type: 'sell', asset: 'USDT', amount: 3000,
    priceBRL: price('USDT', 4), totalBRL: 3000 * price('USDT', 4), fee: 3,
  },

  // ────────────────────────────────────────────────────────────
  // Maio 2025
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-05-02'), exchange: 'Binance',
    type: 'buy', asset: 'ETH', amount: 1,
    priceBRL: price('ETH', 5), totalBRL: 1 * price('ETH', 5), fee: 45.6,
  },
  {
    id: makeId(), date: new Date('2025-05-12'), exchange: 'Mercado Bitcoin',
    type: 'sell', asset: 'BTC', amount: 0.02,
    priceBRL: price('BTC', 5), totalBRL: 0.02 * price('BTC', 5), fee: 9.6,
  },
  {
    id: makeId(), date: new Date('2025-05-20'), exchange: 'Binance',
    type: 'buy', asset: 'SOL', amount: 10,
    priceBRL: price('SOL', 5), totalBRL: 10 * price('SOL', 5), fee: 8.8,
  },

  // ────────────────────────────────────────────────────────────
  // Junho 2025 — Mês TRIBUTÁVEL
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-06-05'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.05,
    priceBRL: price('BTC', 6), totalBRL: 0.05 * price('BTC', 6), fee: 27.5,
  },
  {
    id: makeId(), date: new Date('2025-06-10'), exchange: 'Binance',
    type: 'sell', asset: 'BTC', amount: 0.06,
    priceBRL: price('BTC', 6), totalBRL: 0.06 * price('BTC', 6), fee: 33,
  },
  {
    id: makeId(), date: new Date('2025-06-15'), exchange: 'Mercado Bitcoin',
    type: 'sell', asset: 'ETH', amount: 1.2,
    priceBRL: price('ETH', 6), totalBRL: 1.2 * price('ETH', 6), fee: 51,
  },
  {
    id: makeId(), date: new Date('2025-06-20'), exchange: 'Binance',
    type: 'sell', asset: 'SOL', amount: 15,
    priceBRL: price('SOL', 6), totalBRL: 15 * price('SOL', 6), fee: 15,
  },

  // ────────────────────────────────────────────────────────────
  // Julho a Setembro 2025 — Compras e pequenas vendas (isentas)
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-07-08'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.03,
    priceBRL: price('BTC', 7), totalBRL: 0.03 * price('BTC', 7), fee: 17.7,
  },
  {
    id: makeId(), date: new Date('2025-07-22'), exchange: 'Binance',
    type: 'buy', asset: 'ETH', amount: 0.8,
    priceBRL: price('ETH', 7), totalBRL: 0.8 * price('ETH', 7), fee: 37.1,
  },
  {
    id: makeId(), date: new Date('2025-08-05'), exchange: 'Novadax',
    type: 'buy', asset: 'SOL', amount: 20,
    priceBRL: price('SOL', 8), totalBRL: 20 * price('SOL', 8), fee: 24,
  },
  {
    id: makeId(), date: new Date('2025-08-18'), exchange: 'Binance',
    type: 'sell', asset: 'USDT', amount: 2000,
    priceBRL: price('USDT', 8), totalBRL: 2000 * price('USDT', 8), fee: 2,
  },
  {
    id: makeId(), date: new Date('2025-09-10'), exchange: 'Mercado Bitcoin',
    type: 'buy', asset: 'BTC', amount: 0.04,
    priceBRL: price('BTC', 9), totalBRL: 0.04 * price('BTC', 9), fee: 24,
  },
  {
    id: makeId(), date: new Date('2025-09-25'), exchange: 'Binance',
    type: 'sell', asset: 'SOL', amount: 5,
    priceBRL: price('SOL', 9), totalBRL: 5 * price('SOL', 9), fee: 5.75,
  },

  // ────────────────────────────────────────────────────────────
  // Outubro 2025 — Mês TRIBUTÁVEL (maior do ano)
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-10-03'), exchange: 'Binance',
    type: 'sell', asset: 'BTC', amount: 0.1,
    priceBRL: price('BTC', 10), totalBRL: 0.1 * price('BTC', 10), fee: 65,
  },
  {
    id: makeId(), date: new Date('2025-10-10'), exchange: 'Binance',
    type: 'sell', asset: 'ETH', amount: 1.5,
    priceBRL: price('ETH', 10), totalBRL: 1.5 * price('ETH', 10), fee: 75,
  },
  {
    id: makeId(), date: new Date('2025-10-18'), exchange: 'Mercado Bitcoin',
    type: 'sell', asset: 'SOL', amount: 20,
    priceBRL: price('SOL', 10), totalBRL: 20 * price('SOL', 10), fee: 26,
  },
  {
    id: makeId(), date: new Date('2025-10-25'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.05,
    priceBRL: price('BTC', 10), totalBRL: 0.05 * price('BTC', 10), fee: 32.5,
  },

  // ────────────────────────────────────────────────────────────
  // Novembro e Dezembro 2025 — Compras para posição final 31/12
  // ────────────────────────────────────────────────────────────
  {
    id: makeId(), date: new Date('2025-11-10'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.04,
    priceBRL: price('BTC', 11), totalBRL: 0.04 * price('BTC', 11), fee: 27.2,
  },
  {
    id: makeId(), date: new Date('2025-11-20'), exchange: 'Binance',
    type: 'buy', asset: 'ETH', amount: 1,
    priceBRL: price('ETH', 11), totalBRL: 1 * price('ETH', 11), fee: 64.5,
  },
  {
    id: makeId(), date: new Date('2025-11-28'), exchange: 'Novadax',
    type: 'buy', asset: 'SOL', amount: 15,
    priceBRL: price('SOL', 11), totalBRL: 15 * price('SOL', 11), fee: 21,
  },
  {
    id: makeId(), date: new Date('2025-12-05'), exchange: 'Binance',
    type: 'buy', asset: 'BTC', amount: 0.03,
    priceBRL: price('BTC', 12), totalBRL: 0.03 * price('BTC', 12), fee: 21.6,
  },
  {
    id: makeId(), date: new Date('2025-12-12'), exchange: 'Mercado Bitcoin',
    type: 'buy', asset: 'ETH', amount: 0.5,
    priceBRL: price('ETH', 12), totalBRL: 0.5 * price('ETH', 12), fee: 27.5,
  },
  {
    id: makeId(), date: new Date('2025-12-20'), exchange: 'Binance',
    type: 'buy', asset: 'USDT', amount: 3000,
    priceBRL: price('USDT', 12), totalBRL: 3000 * price('USDT', 12), fee: 3,
  },
  {
    id: makeId(), date: new Date('2025-12-28'), exchange: 'Binance',
    type: 'sell', asset: 'ETH', amount: 0.2,
    priceBRL: price('ETH', 12), totalBRL: 0.2 * price('ETH', 12), fee: 11,
  },
]

// Posição final aproximada em 31/12/2025 (para o relatório IRPF)
export const mockPortfolio2025 = [
  { asset: 'BTC', amount: 0.17, priceBRL: 720000, totalBRL: 0.17 * 720000, irpfCode: '01' },
  { asset: 'ETH', amount: 2.1, priceBRL: 22000, totalBRL: 2.1 * 22000, irpfCode: '02' },
  { asset: 'SOL', amount: 30, priceBRL: 1500, totalBRL: 30 * 1500, irpfCode: '02' },
  { asset: 'USDT', amount: 3000, priceBRL: 6.25, totalBRL: 3000 * 6.25, irpfCode: '03' },
]

export const mockDARFs = [
  {
    id: 'darf-2025-03',
    year: 2025, month: 3,
    code: '4600',
    competencia: '03/2025',
    dueDate: new Date('2025-04-30'),
    amount: 1243.50,
    status: 'paid' as const,
    paidAt: new Date('2025-04-28'),
  },
  {
    id: 'darf-2025-06',
    year: 2025, month: 6,
    code: '4600',
    competencia: '06/2025',
    dueDate: new Date('2025-07-31'),
    amount: 2187.00,
    status: 'paid' as const,
    paidAt: new Date('2025-07-30'),
  },
  {
    id: 'darf-2025-10',
    year: 2025, month: 10,
    code: '4600',
    competencia: '10/2025',
    dueDate: new Date('2025-11-28'),
    amount: 5412.75,
    status: 'overdue' as const,
  },
]

export const mockSummary = {
  portfolioValueBRL: 187_250,
  totalGainBRL: 28_430,
  totalTaxOwedBRL: 8_843.25,
  darfsPending: 2,
}
