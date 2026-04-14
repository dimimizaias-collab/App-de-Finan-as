import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="pt-20 pb-32 px-6 max-w-2xl mx-auto">
      <header className="py-6 space-y-1">
        <h2 className="text-4xl font-extrabold font-headline text-[#4a2507] tracking-tight">Settings</h2>
        <p className="text-sm text-[#805030]">Configurações da conta</p>
      </header>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#9e3c00]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <p className="font-bold text-[#4a2507]">{user.email}</p>
            <p className="text-xs text-[#805030]">Conta Mizumoto</p>
          </div>
        </div>

        <form action="/api/auth/update-password" method="post" className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#9e3c00]">lock</span>
            <h3 className="font-bold font-headline text-[#4a2507]">Alterar Senha</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-1">
                Nova Senha
              </label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                required
                className="w-full bg-orange-50/50 rounded-xl px-4 py-3 outline-none text-[#4a2507] focus:ring-2 focus:ring-[#9e3c00]/20 transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#9e3c00] text-white font-bold rounded-xl py-3 hover:bg-[#853200] transition-colors"
            >
              Salvar Nova Senha
            </button>
          </div>
        </form>

        <form action="/api/auth/signout" method="post">
          <button className="w-full bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left hover:bg-orange-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#b31b25]">
              <span className="material-symbols-outlined">logout</span>
            </div>
            <div>
              <p className="font-bold text-[#b31b25]">Sair da conta</p>
              <p className="text-xs text-[#805030]">Encerrar sessão</p>
            </div>
          </button>
        </form>
      </div>
    </main>
  )
}
