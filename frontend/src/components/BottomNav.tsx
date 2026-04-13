'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/timeline', icon: 'history', label: 'Timeline' },
  { href: '/adicionar', icon: 'add_circle', label: 'Add' },
  { href: '/cadastros', icon: 'category', label: 'Entries' },
  { href: '/configuracoes', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pb-6 pt-3 bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-[0px_-12px_32px_rgba(74,37,7,0.08)] z-50">
      {tabs.map(tab => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-colors ${
              active ? 'bg-orange-100 text-[#9e3c00]' : 'text-stone-400 hover:text-[#9e3c00]'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
