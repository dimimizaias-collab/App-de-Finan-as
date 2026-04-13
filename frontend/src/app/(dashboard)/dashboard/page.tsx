import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
  const monthlyIncome = transactions
    ?.filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0
  const monthlyExpense = transactions
    ?.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Olá, {user.email}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button className="text-sm text-gray-500 hover:text-gray-700">Sair</button>
          </form>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Saldo total</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Receitas do mês</p>
            <p className="text-2xl font-bold text-green-600">
              {monthlyIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Despesas do mês</p>
            <p className="text-2xl font-bold text-red-500">
              {monthlyExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Últimas transações */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Últimas transações</h2>
          {transactions && transactions.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.description || 'Sem descrição'}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('pt-BR')} · {(t.categories as { name: string } | null)?.name ?? 'Sem categoria'}</p>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Nenhuma transação ainda.</p>
          )}
        </div>
      </div>
    </main>
  )
}
