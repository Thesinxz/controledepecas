import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FileText, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScriptsPerDayChart } from '@/app/components/charts/ScriptsPerDayChart'
import { NicheDistributionChart } from '@/app/components/charts/NicheDistributionChart'

export default async function AnalyticsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${host}/api/analytics/stats`, {
        headers: { cookie: `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]}-auth-token=${(await supabase.auth.getSession()).data.session?.access_token}` },
        cache: 'no-store'
    })

    let stats = { lineChartData: [], nicheData: [], totalScripts: 0, totalStories: 0 }
    if (res.ok) {
        stats = await res.json()
    }

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24 animate-in fade-in">
            <div className="flex items-center gap-3">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Analytics</h1>
                    <p className="text-sm text-white/50">Métricas de uso e desempenho</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col gap-1">
                    <div className="p-2 bg-pink-500/20 text-pink-500 rounded-xl w-min mb-2">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Total de Roteiros</span>
                    <span className="text-2xl font-black">{stats.totalScripts}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col gap-1">
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl w-min mb-2">
                        <LayoutList className="w-5 h-5" />
                    </div>
                    <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Total de Stories</span>
                    <span className="text-2xl font-black">{stats.totalStories}</span>
                </div>
            </div>

            <ScriptsPerDayChart data={stats.lineChartData} />
            <NicheDistributionChart data={stats.nicheData} />

        </div>
    )
}
