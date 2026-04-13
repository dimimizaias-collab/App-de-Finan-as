'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function addAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const bank_name = formData.get('bank_name') as string
  const account_number = formData.get('account_number') as string
  const agency = formData.get('agency') as string
  const image_url = formData.get('image_url') as string
  const color = formData.get('color') as string
  const balance = parseFloat(formData.get('balance') as string) || 0

  if (!name || !type) return

  await supabase.from('accounts').insert({
    user_id: user.id,
    name,
    type,
    bank_name: bank_name || null,
    account_number: account_number || null,
    agency: agency || null,
    image_url: image_url || null,
    color: color || '#9e3c00',
    balance,
  })

  redirect('/cadastros')
}
