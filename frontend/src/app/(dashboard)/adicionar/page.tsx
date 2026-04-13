import { createClient } from '@/lib/supabase/server'
import AddTransactionForm from '@/components/AddTransactionForm'
import AddAccountForm from '@/components/AddAccountForm'

export default async function AdicionarPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return <div>Erro de autenticação. Por favor, faça login novamente.</div>
  }

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
        <div className="space-y-6">
          <div className="p-8 bg-white rounded-3xl text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-[#dca079] block mb-3">account_balance_wallet</span>
            <p className="font-bold text-[#4a2507] mb-1">Nenhuma conta cadastrada</p>
            <p className="text-sm text-[#805030]">Crie uma conta abaixo antes de adicionar transações.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-headline text-[#4a2507] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9e3c00]">add_circle</span>
              Nova Conta
            </h3>
            <AddAccountForm userId={user.id} />
          </div>
        </div>
      )}
    </main>
  )
}
