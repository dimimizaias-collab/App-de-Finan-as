import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/navigation'

export async function POST(request: Request) {
  const formData = await request.formData()
  const password = String(formData.get('password'))

  if (!password || password.length < 6) {
    return NextResponse.redirect(new URL('/configuracoes?error=Senha+muito+curta', request.url))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return NextResponse.redirect(new URL('/configuracoes?error=Erro+ao+atualizar+a+senha', request.url))
  }

  return NextResponse.redirect(new URL('/configuracoes?success=Senha+atualizada+com+sucesso', request.url))
}
