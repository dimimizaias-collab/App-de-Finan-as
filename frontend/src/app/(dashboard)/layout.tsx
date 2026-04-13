import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/BottomNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#fff4f0]/80 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <h1 className="text-2xl font-black tracking-tight text-[#9e3c00] font-headline">Mizumoto</h1>
        <form action="/api/auth/signout" method="post">
          <button className="p-2 rounded-full hover:bg-orange-100/50 text-[#9e3c00]/60 transition-colors">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </form>
      </nav>
      {children}
      <BottomNav />
    </>
  )
}
