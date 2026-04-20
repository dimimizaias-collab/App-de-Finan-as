import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardContent from './DashboardContent'

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
    .limit(10)

  // Greetings logic
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = user.email?.split('@')[0] ?? 'você'

  return (
    <DashboardContent 
      initialAccounts={accounts ?? []} 
      initialTransactions={transactions ?? []} 
      userData={{
        firstName,
        greeting: `${greeting}, ${firstName}`
      }}
    />
  )
}
