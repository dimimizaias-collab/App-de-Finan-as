'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Settings, 
  PlusCircle 
} from 'lucide-react'

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Contas', icon: Wallet, href: '/dashboard#contas' },
  { name: 'Investimentos', icon: TrendingUp, href: '/investimentos' },
  { name: 'Relatórios', icon: PieChart, href: '/relatorios' },
  { name: 'Configurações', icon: Settings, href: '/configuracoes' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 hidden md:flex flex-col bg-surface/80 backdrop-blur-xl border-r border-outline-variant/10 z-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Mizumoto</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 mt-1">
          Financial Architect
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-6">
        <Link 
          href="/adicionar"
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary-container text-on-primary-fixed font-bold rounded-2xl shadow-sm hover:scale-[1.02] transition-transform"
        >
          <PlusCircle size={20} />
          Novo Registro
        </Link>
      </div>
    </aside>
  )
}
