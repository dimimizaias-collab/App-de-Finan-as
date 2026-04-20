'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, PlusCircle, Database, Settings } from 'lucide-react'

const tabs = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Início' },
  { href: '/timeline', icon: History, label: 'Extraito' },
  { href: '/adicionar', icon: PlusCircle, label: 'Add', highlight: true },
  { href: '/cadastros', icon: Database, label: 'Contas' },
  { href: '/configuracoes', icon: Settings, label: 'Ajustes' },
]

export default function BottomNav({ className = '' }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={`fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/10 z-50 ${className}`}>
      {tabs.map(tab => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center transition-all ${
              active ? 'text-primary' : 'text-on-surface-variant/60 hover:text-on-surface'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${active ? 'bg-primary/10' : ''} ${tab.highlight ? 'bg-primary text-white shadow-lg shadow-primary/20 -translate-y-2' : ''}`}>
              <tab.icon size={22} strokeWidth={active ? 2.5 : 2} />
            </div>
            {!tab.highlight && (
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1 scale-90">{tab.label}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
