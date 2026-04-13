'use client'

import { useState } from 'react'
import { addAccount } from '@/app/(dashboard)/cadastros/actions'

export default function AddAccountForm({ userId }: { userId: string }) {
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    await addAccount(formData)
    setPending(false)
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Nome da conta</label>
          <input
            name="name"
            type="text"
            required
            placeholder="Ex: Nubank, Itaú..."
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Tipo</label>
          <select
            name="type"
            required
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30 appearance-none bg-white"
          >
            <option value="checking">Conta Corrente</option>
            <option value="savings">Poupança</option>
            <option value="wallet">Carteira</option>
            <option value="credit_card">Cartão de Crédito</option>
            <option value="investment">Investimento</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[#805030]">Saldo inicial</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#9e3c00]">R$</span>
          <input
            name="balance"
            type="number"
            step="0.01"
            defaultValue="0"
            placeholder="0,00"
            className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 font-headline font-bold text-lg text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-headline font-bold py-3.5 rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {pending ? 'Criando...' : 'Criar Conta'}
      </button>
    </form>
  )
}
