'use client'

import { useState } from 'react'
import AddTransactionForm from '@/components/AddTransactionForm'
import AccountForm from '@/components/accounts/account-form'

type Account = { id: string; name: string; type: string }
type Category = { id: string; name: string; type: string }

export default function AdicionarTabs({
  accounts,
  categories,
  userId,
}: {
  accounts: Account[]
  categories: Category[]
  userId: string
}) {
  const [tab, setTab] = useState<'transacao' | 'conta'>('transacao')

  return (
    <div className="space-y-6">
      {/* Toggle tabs */}
      <div className="flex bg-orange-50 rounded-2xl p-1 gap-1">
        <button
          type="button"
          onClick={() => setTab('transacao')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            tab === 'transacao'
              ? 'bg-white text-[#9e3c00] shadow-sm'
              : 'text-[#805030] hover:text-[#9e3c00]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          Transação
        </button>
        <button
          type="button"
          onClick={() => setTab('conta')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            tab === 'conta'
              ? 'bg-white text-[#9e3c00] shadow-sm'
              : 'text-[#805030] hover:text-[#9e3c00]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
          Conta
        </button>
      </div>

      {/* Conteúdo da tab */}
      {tab === 'transacao' ? (
        accounts.length > 0 ? (
          <AddTransactionForm accounts={accounts} categories={categories} />
        ) : (
          <div className="p-8 bg-white rounded-3xl text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-[#dca079] block mb-3">account_balance_wallet</span>
            <p className="font-bold text-[#4a2507] mb-1">Nenhuma conta cadastrada</p>
            <p className="text-sm text-[#805030] mb-4">Crie uma conta primeiro para registrar transações.</p>
            <button
              onClick={() => setTab('conta')}
              className="inline-flex items-center gap-2 bg-[#9e3c00] text-white text-sm font-bold px-5 py-2.5 rounded-xl"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Criar conta agora
            </button>
          </div>
        )
      ) : (
        <AccountForm userId={userId} />
      )}
    </div>
  )
}
