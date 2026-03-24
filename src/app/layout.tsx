import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CriptoIR — Declare suas criptomoedas no IR',
  description:
    'Importe suas transações de exchanges, calcule ganho de capital e gere DARFs automaticamente. 100% adaptado às regras da Receita Federal brasileira.',
  keywords: [
    'declarar criptomoedas imposto de renda',
    'calcular imposto bitcoin brasil',
    'DARF criptomoedas',
    'imposto de renda crypto 2026',
    'isenção 35 mil reais criptomoedas',
  ],
  openGraph: {
    title: 'CriptoIR — Declare suas criptomoedas no IR',
    description: 'A forma mais simples de declarar cripto no Brasil.',
    siteName: 'CriptoIR',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
