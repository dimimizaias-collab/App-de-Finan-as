import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import AddAccountForm from '@/components/AddAccountForm'

const accountTypeLabel: Record<string, string> = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  wallet: 'Carteira / Dinheiro',
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
              <h3 className="text-xl font-bold font-headline text-[#4a2507]">Minhas Contas</h3>
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
                  className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm transition-transform hover:scale-[1.01]"
                >
                  {/* Avatar: imagem ou cor + ícone */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: a.image_url ? undefined : (a.color ?? '#9e3c00') + '20' }}
                  >
                    {a.image_url ? (
                      <Image
                        src={a.image_url}
                        alt={a.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ color: a.color ?? '#9e3c00', fontVariationSettings: "'FILL' 1" }}
                      >
                        {accountTypeIcon[a.type] ?? 'account_balance'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#4a2507] truncate">{a.name}</h4>
                    <p className="text-xs text-[#805030] truncate">
                      {[a.bank_name, accountTypeLabel[a.type]].filter(Boolean).join(' · ')}
                    </p>
                    {(a.agency || a.account_number) && (
                      <p className="text-xs text-[#9e3c00]/70 mt-0.5">
                        {a.agency ? `Ag. ${a.agency}` : ''}
                        {a.agency && a.account_number ? ' · ' : ''}
                        {a.account_number ? `Cc. ${a.account_number}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Saldo */}
                  <div className="text-right shrink-0">
                    <p className="font-extrabold font-headline text-[#4a2507]">
                      {Number(a.balance).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: a.color ?? '#9e3c00' }}
                    >
                      Ativa
                    </span>
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
