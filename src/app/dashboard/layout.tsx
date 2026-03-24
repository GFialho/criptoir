'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Upload,
  List,
  FileBarChart,
  Receipt,
  LogOut,
  Bitcoin,
  Zap,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/importar', label: 'Importar', icon: Upload },
  { href: '/dashboard/transacoes', label: 'Transações', icon: List },
  { href: '/dashboard/relatorio', label: 'Relatório IRPF', icon: FileBarChart },
  { href: '/dashboard/darf', label: 'DARFs', icon: Receipt },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
            <Bitcoin className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">CriptoIR</p>
            <p className="text-xs text-slate-400 mt-0.5">Plano Grátis</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Upgrade banner */}
        <div className="mx-3 mb-3 rounded-xl bg-indigo-50 border border-indigo-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-indigo-600" />
            <p className="text-sm font-semibold text-indigo-900">Upgrade para Pro</p>
          </div>
          <p className="text-xs text-indigo-600 mb-3">Transações ilimitadas e DARFs</p>
          <Link href="/precos">
            <button className="w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
              Ver planos
            </button>
          </Link>
        </div>

        {/* User / bottom */}
        <div className="border-t border-slate-100 p-3">
          <div className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 flex-shrink-0">
              G
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">gabriel@exemplo.com</p>
              <p className="text-xs text-slate-400">Plano Grátis</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-8 py-3 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Ano-calendário{' '}
              <span className="text-indigo-600 font-semibold">2025</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500">Motor fiscal ativo</span>
          </div>
        </div>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
