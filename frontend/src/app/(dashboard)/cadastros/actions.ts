'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function addAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const balance = parseFloat(formData.get('balance') as string) || 0

  if (!name || !type) return

  await supabase.from('accounts').insert({
    user_id: user.id,
    name,
    type,
    balance,
  })

  redirect('/cadastros')
}
