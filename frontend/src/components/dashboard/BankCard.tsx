'use client'

import { Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface BankCardProps {
  name: string
  balance: number
  trend?: number // Percentage
  color?: string
}

export default function BankCard({ name, balance, trend = 0, color = "#0054cc" }: BankCardProps) {
  const isPositive = trend >= 0

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0px_20px_40px_rgba(25,27,35,0.04)] hover:shadow-[0px_20px_40px_rgba(25,27,35,0.08)] transition-all flex flex-col justify-between min-h-[200px] border border-outline-variant/5">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
          <Building2 size={24} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
          isPositive ? 'bg-success/10 text-emerald-600' : 'bg-error/10 text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/50">{name}</p>
        <h3 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
          {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </h3>
      </div>

      {/* Minimalist Sparkline Placeholder */}
      <div className="mt-6 h-12 w-full flex items-end gap-[2px]">
        {[40, 60, 45, 70, 55, 80, 65, 90, 75, 100].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-primary/10 rounded-t-sm transition-all hover:bg-primary/30" 
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}
