'use client'

import { TrendingUp, Target, ArrowRight } from 'lucide-react'

export default function InsightsCard() {
  return (
    <div className="bg-primary text-white p-8 rounded-[1.5rem] shadow-xl shadow-primary/20 flex flex-col justify-between h-full min-h-[300px] relative overflow-hidden group">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
      
      <div className="relative z-10">
        <div className="p-2.5 rounded-xl bg-white/20 w-fit">
          <TrendingUp size={24} />
        </div>
        
        <h3 className="text-2xl font-bold mt-6 tracking-tight leading-tight">
          Crescimento de <br /> Patrimônio
        </h3>
        <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-[200px]">
          Seu capital cresceu **2.4%** este mês. Você está a 15% da sua meta anual.
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-white/60" />
            <span className="text-sm font-bold">Meta: Independência</span>
          </div>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  )
}
