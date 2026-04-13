'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function FabMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="fixed right-6 bottom-32 z-40 flex flex-col items-end gap-3">
      {/* Opções — aparecem acima do botão */}
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Link
          href="/cadastros#nova-conta"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 bg-white text-[#4a2507] font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg hover:bg-orange-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#9e3c00] text-xl">account_balance_wallet</span>
          Nova Conta
        </Link>

        <Link
          href="/adicionar"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 bg-white text-[#4a2507] font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg hover:bg-orange-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#9e3c00] text-xl">receipt_long</span>
          Nova Transação
        </Link>
      </div>

      {/* Botão FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-[#fff0ea] shadow-[0px_12px_32px_rgba(74,37,7,0.25)] flex items-center justify-center transition-transform active:scale-90"
        aria-label="Adicionar"
      >
        <span
          className={`material-symbols-outlined text-3xl transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          add
        </span>
      </button>
    </div>
  )
}
