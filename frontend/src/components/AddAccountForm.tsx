'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { addAccount } from '@/app/(dashboard)/cadastros/actions'

const BANKS = [
  'Nubank', 'Itaú', 'Bradesco', 'Santander', 'Banco do Brasil',
  'Caixa Econômica Federal', 'Inter', 'C6 Bank', 'XP Investimentos',
  'BTG Pactual', 'Sicoob', 'Sicredi', 'PicPay', 'Mercado Pago',
  'Next', 'Neon', 'PagBank', 'Outro',
]

const COLORS = [
  '#9e3c00', '#b31b25', '#1a5276', '#1e8449', '#6c3483',
  '#d35400', '#117a65', '#2e4057', '#b7950b', '#4a235a',
]

export default function AddAccountForm({ userId }: { userId: string }) {
  const [pending, setPending] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 2MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    try {
      let imageUrl = ''

      if (imageFile) {
        const supabase = createClient()
        const ext = imageFile.name.split('.').pop()
        const path = `${userId}/${Date.now()}.${ext}`
        const { data, error: uploadError } = await supabase.storage
          .from('account-images')
          .upload(path, imageFile, { upsert: true })

        if (uploadError) {
          setError('Erro ao enviar imagem. Tente novamente.')
          setPending(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('account-images')
          .getPublicUrl(data.path)
        imageUrl = publicUrl
      }

      formData.set('image_url', imageUrl)
      formData.set('color', selectedColor)
      await addAccount(formData)
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
      setPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

      {/* Imagem + Cor */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#805030]">Imagem de identificação</label>
        <div className="flex items-center gap-5">
          {/* Preview */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-orange-200 flex items-center justify-center bg-orange-50 hover:bg-orange-100 transition-colors shrink-0"
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-[#805030]">
                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <span className="text-[10px] font-semibold">Foto</span>
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Cores */}
          <div className="flex-1 space-y-2">
            <p className="text-xs font-semibold text-[#805030]">Ou escolha uma cor</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-offset-2 ring-[#9e3c00]' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        {imagePreview && (
          <button
            type="button"
            onClick={() => { setImageFile(null); setImagePreview(null) }}
            className="text-xs text-[#b31b25] font-semibold hover:underline"
          >
            Remover imagem
          </button>
        )}
      </div>

      {/* Nome + Banco */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Nome que uso para a conta</label>
          <input
            name="name"
            type="text"
            required
            placeholder="Ex: Meu Nubank, Reserva..."
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Banco</label>
          <select
            name="bank_name"
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30 appearance-none bg-white"
          >
            <option value="">Selecione o banco</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Tipo */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[#805030]">Tipo de conta</label>
        <select
          name="type"
          required
          className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30 appearance-none bg-white"
        >
          <option value="checking">Conta Corrente</option>
          <option value="savings">Poupança</option>
          <option value="wallet">Carteira / Dinheiro</option>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="investment">Investimento</option>
        </select>
      </div>

      {/* Agência + Número da conta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Agência</label>
          <input
            name="agency"
            type="text"
            placeholder="Ex: 0001"
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#805030]">Número da conta</label>
          <input
            name="account_number"
            type="text"
            placeholder="Ex: 12345-6"
            className="w-full border border-orange-200 rounded-xl py-3 px-4 text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>
      </div>

      {/* Saldo inicial */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[#805030]">Saldo inicial</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#9e3c00]">R$</span>
          <input
            name="balance"
            type="number"
            step="0.01"
            defaultValue="0"
            placeholder="0,00"
            className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 font-headline font-bold text-lg text-[#4a2507] focus:outline-none focus:ring-2 focus:ring-[#9e3c00]/30"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#b31b25] font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-headline font-bold py-3.5 rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {pending ? 'Criando...' : 'Criar Conta'}
      </button>
    </form>
  )
}
