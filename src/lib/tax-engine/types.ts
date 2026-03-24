export type TransactionType = 'buy' | 'sell' | 'transfer_in' | 'transfer_out' | 'fee' | 'staking' | 'airdrop'

export interface Transaction {
  id: string
  date: Date
  exchange: string
  type: TransactionType
  asset: string
  amount: number
  priceUSD?: number
  priceBRL: number
  totalBRL: number
  fee: number
  feeCurrency?: string
  notes?: string
}

export interface CostBasisLot {
  date: Date
  amount: number
  costPerUnit: number
  totalCost: number
  exchange: string
}

export interface AssetPosition {
  asset: string
  totalAmount: number
  averageCost: number
  totalCost: number
  lots: CostBasisLot[]
}

export interface MonthlyGainResult {
  year: number
  month: number
  totalSales: number
  totalCost: number
  grossGain: number
  isExempt: boolean
  taxableGain: number
  taxRate: number
  taxOwed: number
  transactions: Transaction[]
}

export interface TaxReport {
  year: number
  monthlyResults: MonthlyGainResult[]
  totalTaxOwed: number
  totalGain: number
  totalExempt: number
  positions: AssetPosition[]
}

export interface DARF {
  id: string
  year: number
  month: number
  code: string // 4600
  competencia: string // MM/YYYY
  dueDate: Date
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  paidAt?: Date
}

export interface ParsedTransaction {
  date: Date
  type: TransactionType
  asset: string
  amount: number
  priceBRL: number
  totalBRL: number
  fee: number
  feeCurrency?: string
  exchange: string
}

export type ExchangeParser = (csvContent: string) => ParsedTransaction[]
