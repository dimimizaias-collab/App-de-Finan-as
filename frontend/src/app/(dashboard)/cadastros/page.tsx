import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddAccountForm from '@/components/AddAccountForm'

const accountTypeLabel: Record<string, string> = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  wallet: 'Carteira',
  credit_card: 'Cartão de Crédito',
  investment: 'Investimento',
}

const accountTypeIcon: Record<string, string> = {
  checking: 'account_balance',
  savings: 'savings',
  wallet: 'account_balance_wallet',
  credit_card: 'credit_card',
  investment: 'trending_up',
}

export default async function CadastrosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: true })

  const total = accounts?.reduce((sum, a) => sum + Number(a.balance), 0) ?? 0

  return (
    <main className="pt-20 pb-32 px-6 max-w-3xl mx-auto">
      <header className="py-6 space-y-1">
        <h2 className="text-4xl font-extrabold font-headline text-[#4a2507] tracking-tight">Cadastros</h2>
        <p className="text-sm text-[#805030]">Gerencie suas contas</p>
      </header>

      <div className="space-y-8">
        {/* Lista de contas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9e3c00]">account_balance_wallet</span>
              <h3 className="text-xl font-bold font-headline text-[#4a2507]">Contas</h3>
            </div>
            <div className="bg-orange-100 px-4 py-1.5 rounded-full">
              <span className="text-sm font-bold text-[#9e3c00]">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          {accounts && accounts.length > 0 ? (
            <div className="space-y-3">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#9e3c00]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {accountTypeIcon[a.type] ?? 'account_balance'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#4a2507]">{a.name}</h4>
                      <p className="text-xs text-[#805030]">{accountTypeLabel[a.type] ?? a.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold font-headline text-[#4a2507]">
                      {Number(a.balance).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#9e3c00]">Ativa</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl text-center shadow-sm">
              <span className="material-symbols-outlined text-4xl text-[#dca079] block mb-2">account_balance</span>
              <p className="text-sm text-[#805030]">Nenhuma conta ainda. Crie uma abaixo.</p>
            </div>
          )}
        </section>

        {/* Formulário nova conta */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e3c00]">add_circle</span>
            <h3 className="text-xl font-bold font-headline text-[#4a2507]">Nova Conta</h3>
          </div>
          <AddAccountForm userId={user.id} />
        </section>
      </div>
    </main>
  )
}
