'use client'

import { useState } from 'react'
import AccountSelector from '@/components/dashboard/AccountSelector'
import BankCard from '@/components/dashboard/BankCard'
import InsightsCard from '@/components/dashboard/InsightsCard'
import { TrendingUp, TrendingDown, ReceiptText } from 'lucide-react'
import Link from 'next/link'

interface DashboardContentProps {
  initialAccounts: any[]
  initialTransactions: any[]
  userData: {
    firstName: string
    greeting: string
  }
}

export default function DashboardContent({ 
  initialAccounts, 
  initialTransactions,
  userData 
}: DashboardContentProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  // Filter accounts and transactions based on selection
  const accountsToDisplay = selectedAccountId 
    ? initialAccounts.filter(a => a.id === selectedAccountId)
    : initialAccounts

  const totalBalance = accountsToDisplay.reduce((sum: number, acc: any) => sum + Number(acc.balance), 0)

  // Transactions are global for now, or filtered if we want
  const transactions = initialTransactions

  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto space-y-12">
      {/* Editorial Header */}
      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">
            Status: {userData.greeting}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
            Patrimônio Consolidado
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-sm font-bold text-on-surface-variant/40">Total Líquido</span>
            <div className="text-5xl md:text-6xl font-bold tracking-tighter text-on-surface mt-1 tabular-nums">
              {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          
          <AccountSelector 
            accounts={initialAccounts} 
            selectedId={selectedAccountId} 
            onSelect={setSelectedAccountId} 
          />
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bank Cards */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountsToDisplay.map((acc: any) => (
              <BankCard 
                key={acc.id}
                name={acc.name}
                balance={Number(acc.balance)}
                trend={2.4} // Mock trend
              />
            ))}
          </div>

          {/* Recent Activity */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/40">Atividade Recente</h3>
              <Link href="/timeline" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Ver tudo</Link>
            </div>

            <div className="space-y-4">
              {transactions.map((t: any) => {
                const isIncome = t.type === 'income'
                return (
                  <div key={t.id} className="flex items-center justify-between p-6 bg-surface-container-low/50 hover:bg-surface-container-high transition-colors rounded-2xl group">
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-xl ${isIncome ? 'bg-success/10 text-emerald-600' : 'bg-on-surface-variant/10 text-on-surface-variant'}`}>
                         <ReceiptText size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{t.description || 'Transação'}</h4>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50 mt-1">
                          {new Date(t.date).toLocaleDateString('pt-BR')} · {t.categories?.name}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-on-surface'}`}>
                      {isIncome ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Insights (Desktop Only Side) */}
        <div className="lg:col-span-4 space-y-8">
          <InsightsCard />
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-surface-container-low rounded-2xl">
                <TrendingUp className="text-emerald-500 mb-4" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Entradas</span>
                <p className="text-lg font-bold mt-1 text-on-surface">R$ 12.450</p>
             </div>
             <div className="p-6 bg-surface-container-low rounded-2xl">
                <TrendingDown className="text-rose-500 mb-4" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Saídas</span>
                <p className="text-lg font-bold mt-1 text-on-surface">R$ 8.120</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
