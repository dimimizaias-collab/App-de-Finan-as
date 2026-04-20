'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addTransaction } from '@/app/(dashboard)/adicionar/actions'

type Account = { id: string; name: string; type: string }
type Category = { id: string; name: string; type: string }

export default function AddTransactionForm({
  accounts,
  categories,
}: {
  accounts: Account[]
  categories: Category[]
}) {
  const router = useRouter()
  const [txType, setTxType] = useState<'expense' | 'income'>('expense')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const filteredCategories = categories.filter(c => c.type === txType)
  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    formData.set('type', txType)
    try {
      await addTransaction(formData)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar transação')
      setPending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-orange-100 pb-4">
        <h2 className="font-headline font-bold text-xl text-[#4a2507] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#9e3c00]">add_card</span>
          Nova Transação
        </h2>
      </div>

      {/* Tipo toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTxType('expense')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            txType === 'expense'
              ? 'bg-[#b31b25] text-white shadow-sm'
              : 'bg-orange-50 text-[#805030]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">arrow_upward</span>
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setTxType('income')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            txType === 'income'
              ? 'bg-[#9e3c00] text-white shadow-sm'
              : 'bg-orange-50 text-[#805030]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">arrow_downward</span>
          Receita
        </button>
      </div>

      <form action={handleSubmit} className="space-y-5">
        {/* Valor + Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#805030]">Valor</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#9e3c00]">R$</span>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0,00"
                className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 font-headline font-bold text-xl text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#805030]">Data</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={today}
              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Descrição</label>
          <input
            name="description"
            type="text"
            placeholder="Ex: Aluguel, Supermercado..."
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>

        {/* Categoria + Conta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#805030]">Categoria</label>
            <select
              name="category_id"
              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30 appearance-none bg-white"
            >
              <option value="">Sem categoria</option>
              {filteredCategories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#805030]">Conta</label>
            {accounts.length === 0 ? (
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-center justify-between">
                <span className="text-xs text-[#805030] font-medium">Nenhuma conta cadastrada</span>
                <button
                  type="button"
                  onClick={() => router.push('/cadastros#nova-conta')}
                  className="text-xs text-[#9e3c00] font-bold underline"
                >
                  Criar Agora
                </button>
              </div>
            ) : (
              <select
                name="account_id"
                required
                className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30 appearance-none bg-white"
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-[#b31b25] text-lg shrink-0 mt-0.5">error</span>
            <p className="text-sm text-[#b31b25] font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={pending}
            className="flex-1 border border-orange-200 text-[#805030] font-headline font-bold py-4 rounded-xl hover:bg-orange-50 disabled:opacity-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-[2] bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-headline font-bold py-4 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {pending ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </div>
      </form>
    </div>
  )
}
