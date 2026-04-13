import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import FabMenu from '@/components/FabMenu'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name, color)')
    .order('date', { ascending: false })
    .limit(5)

  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) ?? 0

  const currentMonth = new Date().toISOString().slice(0, 7)
  const allMonthTx = transactions?.filter(t => t.date?.startsWith(currentMonth)) ?? []
  const monthlyIncome = allMonthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const monthlyExpense = allMonthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

  const firstName = user.email?.split('@')[0] ?? 'você'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <header className="space-y-1">
        <p className="text-[#805030] text-sm font-semibold uppercase tracking-widest">
          {greeting}, {firstName}
        </p>
        <h2 className="text-4xl font-extrabold font-headline text-[#4a2507] tracking-tight">Dashboard</h2>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 p-8 rounded-3xl bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-[#fff0ea] shadow-[0px_12px_32px_rgba(74,37,7,0.15)] flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[#fff0ea]/80 text-xs font-semibold uppercase tracking-wider">Saldo Total</span>
            <h3 className="text-5xl font-extrabold font-headline mt-2 tabular-nums">
              {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[#fff0ea]/90 text-sm font-medium">
            <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
            <span>{accounts?.length ?? 0} {(accounts?.length ?? 0) === 1 ? 'conta' : 'contas'} vinculada{(accounts?.length ?? 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-1 p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#9e3c00]">
                <span className="material-symbols-outlined">arrow_downward</span>
              </div>
              <span className="text-[#805030] text-xs font-semibold uppercase tracking-wider">Entradas</span>
            </div>
            <p className="text-2xl font-bold font-headline text-[#4a2507]">
              {monthlyIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="flex-1 p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#9e3c00]">
                <span className="material-symbols-outlined">arrow_upward</span>
              </div>
              <span className="text-[#805030] text-xs font-semibold uppercase tracking-wider">Saídas</span>
            </div>
            <p className="text-2xl font-bold font-headline text-[#4a2507]">
              {monthlyExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold font-headline text-[#4a2507]">Atividade Recente</h3>
          <Link href="/timeline" className="text-[#9e3c00] text-xs font-bold uppercase tracking-widest hover:underline">
            Ver todos
          </Link>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((t) => {
              const isIncome = t.type === 'income'
              const category = (t.categories as { name: string } | null)?.name ?? 'Sem categoria'
              return (
                <div key={t.id} className="p-5 bg-white rounded-3xl flex items-center justify-between shadow-sm transition-transform duration-200 hover:scale-[1.01]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#9e3c00]">
                      <span className="material-symbols-outlined">{isIncome ? 'payments' : 'shopping_cart'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#4a2507]">{t.description || 'Sem descrição'}</h4>
                      <p className="text-xs text-[#805030] font-medium">
                        {new Date(t.date + 'T12:00:00').toLocaleDateString('pt-BR')} · {category}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold font-headline ${isIncome ? 'text-[#9e3c00]' : 'text-[#b31b25]'}`}>
                    {isIncome ? '+' : '-'}
                    {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#dca079] block mb-2">receipt_long</span>
            <p className="text-sm text-[#805030] mb-4">Nenhuma transação ainda.</p>
            <Link href="/adicionar" className="inline-flex items-center gap-2 bg-[#9e3c00] text-white text-sm font-bold px-5 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-lg">add</span>
              Adicionar transação
            </Link>
          </div>
        )}
      </section>

      {/* FAB */}
      <FabMenu />
    </main>
  )
}
