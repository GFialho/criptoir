import { MonthlyGainResult, DARF } from './types'
import { format, lastDayOfMonth, addMonths } from 'date-fns'

// Código DARF para ganho de capital em renda variável / criptoativos
export const DARF_CODE = '4600'

/**
 * Calcula o último dia útil do mês.
 * Regra: se cair em sábado ou domingo, voltar para sexta.
 */
function lastBusinessDayOfMonth(year: number, month: number): Date {
  // month é 1-indexed (1-12)
  const lastDay = lastDayOfMonth(new Date(year, month - 1, 1))
  const dayOfWeek = lastDay.getDay()

  if (dayOfWeek === 0) {
    // Domingo → sexta
    lastDay.setDate(lastDay.getDate() - 2)
  } else if (dayOfWeek === 6) {
    // Sábado → sexta
    lastDay.setDate(lastDay.getDate() - 1)
  }

  return lastDay
}

/**
 * Gera DARFs a partir dos resultados mensais de ganho de capital.
 * DARF deve ser pago até o último dia útil do mês seguinte à venda.
 */
export function generateDARFs(monthlyResults: MonthlyGainResult[]): DARF[] {
  const darfs: DARF[] = []
  const now = new Date()

  for (const result of monthlyResults) {
    if (result.taxOwed <= 0) continue

    // Mês seguinte ao da venda
    const nextMonth = addMonths(new Date(result.year, result.month - 1, 1), 1)
    const dueDate = lastBusinessDayOfMonth(nextMonth.getFullYear(), nextMonth.getMonth() + 1)

    const status: DARF['status'] = dueDate < now ? 'overdue' : 'pending'

    darfs.push({
      id: `darf-${result.year}-${String(result.month).padStart(2, '0')}`,
      year: result.year,
      month: result.month,
      code: DARF_CODE,
      competencia: format(new Date(result.year, result.month - 1, 1), 'MM/yyyy'),
      dueDate,
      amount: result.taxOwed,
      status,
    })
  }

  return darfs
}

export function formatDARFPeriod(year: number, month: number): string {
  const date = new Date(year, month - 1, 1)
  return format(date, 'MM/yyyy')
}

export function getDARFDueDate(year: number, month: number): Date {
  const nextMonth = addMonths(new Date(year, month - 1, 1), 1)
  return lastBusinessDayOfMonth(nextMonth.getFullYear(), nextMonth.getMonth() + 1)
}
