'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const category_id = formData.get('category_id') as string
  const account_id = formData.get('account_id') as string

  if (!amount || !type || !date || !account_id) return

  await supabase.from('transactions').insert({
    user_id: user.id,
    account_id,
    category_id: category_id || null,
    amount,
    type,
    description: description || null,
    date,
    is_paid: true,
  })

  redirect('/timeline')
}
