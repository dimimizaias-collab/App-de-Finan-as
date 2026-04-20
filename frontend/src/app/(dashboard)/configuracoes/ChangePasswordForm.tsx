'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' })
      return
    }

    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar a senha. Tente novamente.' })
    } else {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' })
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-orange-50/50 rounded-xl px-4 py-3 outline-none text-[#4a2507] focus:ring-2 focus:ring-[#9e3c00]/20 transition-all"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#9e3c00] text-white font-bold rounded-xl py-3 hover:bg-[#853200] transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Nova Senha'}
        </button>
      </div>
    </form>
  )
}
