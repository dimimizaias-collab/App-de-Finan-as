'use client'

interface AccountSelectorProps {
  accounts: any[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function AccountSelector({ accounts, selectedId, onSelect }: AccountSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
          selectedId === null
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
        }`}
      >
        Consolidade
      </button>

      {accounts.map((acc) => (
        <button
          key={acc.id}
          onClick={() => onSelect(acc.id)}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
            selectedId === acc.id
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          {acc.name}
        </button>
      ))}
    </div>
  )
}
