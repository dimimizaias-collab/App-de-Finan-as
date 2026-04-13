import { createClient } from '@/lib/supabase/server'
import AddTransactionForm from '@/components/AddTransactionForm'
import Link from 'next/link'

export default async function AdicionarPage() {
  const supabase = await createClient()

  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from('accounts').select('id, name, type').order('name'),
    supabase.from('categories').select('id, name, type').order('name'),
  ])

  return (
    <main className="pt-20 pb-32 px-6 max-w-2xl mx-auto">
      <header className="py-6 space-y-1">
        <h2 className="text-4xl font-extrabold font-headline text-[#4a2507] tracking-tight">Adicionar</h2>
        <p className="text-sm text-[#805030]">Registre uma nova transação</p>
      </header>

      {accounts && accounts.length > 0 ? (
        <AddTransactionForm
          accounts={accounts}
          categories={categories ?? []}
        />
      ) : (
        <div className="p-10 bg-white rounded-3xl text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-[#dca079] block mb-3">account_balance_wallet</span>
          <p className="font-bold text-[#4a2507] mb-1">Nenhuma conta cadastrada</p>
          <p className="text-sm text-[#805030] mb-5">Crie uma conta antes de adicionar transações.</p>
          <Link
            href="/cadastros"
            className="inline-flex items-center gap-2 bg-[#9e3c00] text-white text-sm font-bold px-5 py-2.5 rounded-xl"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Criar conta
          </Link>
        </div>
      )}
    </main>
  )
}
