'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff4f0] px-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#b31b25] mx-auto">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-headline text-[#4a2507]">Ops! Algo deu errado</h2>
          <p className="text-sm text-[#805030]">
            {error.message || 'Ocorreu um erro inesperado ao carregar seus cadastros.'}
          </p>
          {error.digest && (
            <p className="text-[10px] text-[#805030]/50 font-mono">ID do erro: {error.digest}</p>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="w-full bg-[#9e3c00] text-white py-4 rounded-2xl font-bold font-headline shadow-sm hover:opacity-90 transition-all"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
