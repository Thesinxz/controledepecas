import { createClient } from '@/app/lib/supabase/server'
import { MetricCard } from '@/app/components/admin/MetricCard'
import { Users, Video, DollarSign, ArrowUpRight } from 'lucide-react'

export default async function AdminOverview() {
    const supabase = await createClient()

    // Dashboard metrics aggregations
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: proUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('plan', ['pro', 'business'])
    const { count: totalScripts } = await supabase.from('scripts').select('*', { count: 'exact', head: true })

    return (
        <div className="flex flex-col gap-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-2">Visão Geral</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Total de Usuários"
                    value={totalUsers?.toString() || '0'}
                    icon={<Users className="w-5 h-5 text-blue-400" />}
                    trend="+12% que mês passado"
                    trendUp={true}
                />
                <MetricCard
                    title="Assinantes Ativos"
                    value={proUsers?.toString() || '0'}
                    icon={<DollarSign className="w-5 h-5 text-green-400" />}
                    trend="+5% que mês passado"
                    trendUp={true}
                />
                <MetricCard
                    title="Roteiros Gerados (Life)"
                    value={totalScripts?.toString() || '0'}
                    icon={<Video className="w-5 h-5 text-pink-400" />}
                    trend="+1.2k esta semana"
                    trendUp={true}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        Recita Estimada (MRR)
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">R$ {(proUsers || 0) * 29}</span>
                        <span className="text-sm text-white/50">/mês</span>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        Ação Rápida
                    </h3>
                    <button className="w-full flex items-center justify-between p-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-colors border border-purple-500/20">
                        <span className="font-medium text-sm">Disparar Push Notification</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 text-white mt-2 rounded-xl transition-colors border border-white/5">
                        <span className="font-medium text-sm">Gerar Relatório CSV</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
