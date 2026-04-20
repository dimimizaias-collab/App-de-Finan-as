'use client'

import { LogOut, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 z-40 px-6 md:px-10 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/60 md:hidden">
          Mizumoto
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
        
        <form action="/api/auth/signout" method="post">
          <button className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-error/10 text-on-surface-variant hover:text-error transition-all group">
            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Sair</span>
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </header>
  )
}
