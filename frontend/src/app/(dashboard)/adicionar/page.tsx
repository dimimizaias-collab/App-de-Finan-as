import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdicionarTabs from '@/components/AdicionarTabs'

export default async function AdicionarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from('accounts').select('id, name, type').order('name'),
    supabase.from('categories').select('id, name, type').order('name'),
  ])

  return (
    <main className="pt-20 pb-32 px-6 max-w-2xl mx-auto">
      <header className="py-6 space-y-1">
        <h2 className="text-4xl font-extrabold font-headline text-[#4a2507] tracking-tight">Adicionar</h2>
        <p className="text-sm text-[#805030]">Registre uma transação ou crie uma nova conta</p>
      </header>

      <AdicionarTabs
        accounts={accounts ?? []}
        categories={categories ?? []}
        userId={user.id}
      />
    </main>
  )
}
