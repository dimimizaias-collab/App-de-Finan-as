import { createClient } from '@/lib/supabase/server'

type Transaction = {
  id: string
  type: string
  amount: number
  description: string | null
  date: string
  categories: { name: string; color: string } | null
}

function formatDateLabel(dateStr: string): string {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const d = new Date(dateStr + 'T12:00:00')
  const todayStr = today.toISOString().slice(0, 10)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (dateStr === todayStr) return 'Hoje'
  if (dateStr === yesterdayStr) return 'Ontem'

  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

export default async function TimelinePage() {
  const supabase = await createClient()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name, color)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  // Group by date
  const grouped: Record<string, Transaction[]> = {}
  for (const t of transactions ?? []) {
    if (!grouped[t.date]) grouped[t.date] = []
    grouped[t.date].push(t as Transaction)
  }

  const iconMap: Record<string, string> = {
    income: 'payments',
    expense: 'shopping_cart',
    transfer: 'swap_horiz',
  }

  return (
    <main className="pt-20 pb-32 px-6 max-w-2xl mx-auto">
      <header className="py-6 space-y-1">
        <h2 className="text-4xl font-extrabold font-headline text-[#4a2507] tracking-tight">Timeline</h2>
        <p className="text-sm text-[#805030]">Histórico completo de transações</p>
      </header>

      {Object.keys(grouped).length === 0 ? (
        <div className="p-10 bg-white rounded-3xl text-center shadow-sm mt-4">
          <span className="material-symbols-outlined text-5xl text-[#dca079] block mb-3">receipt_long</span>
          <p className="text-[#805030] font-medium">Nenhuma transação registrada.</p>
        </div>
      ) : (
        <section className="space-y-8">
          {Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <div className="sticky top-16 py-3 bg-[#fff4f0] z-10">
                <h3 className="text-[#805030] font-bold tracking-wide text-xs uppercase">
                  {formatDateLabel(date)}
                </h3>
              </div>
              <div className="space-y-3">
                {txs.map((t) => {
                  const isIncome = t.type === 'income'
                  return (
                    <div
                      key={t.id}
                      className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#9e3c00] shrink-0">
                        <span className="material-symbols-outlined">{iconMap[t.type] ?? 'payments'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#4a2507] truncate">{t.description || 'Sem descrição'}</h4>
                        <p className="text-xs text-[#805030] font-medium">
                          {t.categories?.name ?? 'Sem categoria'}
                        </p>
                      </div>
                      <span className={`font-extrabold font-headline shrink-0 ${isIncome ? 'text-[#9e3c00]' : 'text-[#b31b25]'}`}>
                        {isIncome ? '+' : '-'}
                        {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
