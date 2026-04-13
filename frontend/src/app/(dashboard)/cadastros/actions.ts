'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const bank_name = formData.get('bank_name') as string
  const account_number = formData.get('account_number') as string
  const agency = formData.get('agency') as string
  const image_url = formData.get('image_url') as string
  const color = formData.get('color') as string
  const balance = parseFloat(formData.get('balance') as string) || 0

  if (!name || !type) throw new Error('Nome e tipo são obrigatórios')

  // Garante que o perfil existe antes de inserir a conta
  await supabase.from('profiles').upsert(
    { id: user.id },
    { onConflict: 'id', ignoreDuplicates: true }
  )

  const { error } = await supabase.from('accounts').insert({
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

  if (error) throw new Error(error.message)

  revalidatePath('/cadastros')
  revalidatePath('/adicionar')
  revalidatePath('/dashboard')

  return { success: true }
}
