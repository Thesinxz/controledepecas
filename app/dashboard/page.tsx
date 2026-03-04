import Link from 'next/link'
import { PlusCircle, Sparkles, Zap, Video, History, BarChart3, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile?.onboarding_completed) {
        redirect('/onboarding')
    }

    const { data: recentScripts } = await supabase
        .from('scripts')
        .select('id, title, created_at, story_count')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    const limit = profile.scripts_limit || 10
    const used = profile.scripts_used_this_month || 0
    const usagePercent = Math.min((used / limit) * 100, 100)

    return (
        <div className="flex flex-col w-full gap-8 py-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Olá, {profile.full_name?.split(' ')[0] || 'Criador'}! 👋</h1>
                    <p className="text-sm text-white/50">O que vamos vender hoje?</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-pink-400">
                    {profile.plan === 'pro' ? 'PRO' : profile.plan === 'business' ? 'BIZ' : 'FREE'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Link href="/create" className="col-span-2">
                    <div className="relative group overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-white/10 hover:border-pink-500/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center justify-center gap-3 relative z-10 text-center">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full shadow-lg">
                                <PlusCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Novo Roteiro</h2>
                                <p className="text-xs text-white/60">Gere com IA</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/analytics" className="col-span-1">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col gap-3 hover:bg-white/10 transition-colors h-full">
                        <div className="p-3 bg-blue-500/20 rounded-xl w-fit">
                            <BarChart3 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Analytics</span>
                            <span className="text-[10px] text-white/50">Seu desempenho</span>
                        </div>
                    </div>
                </Link>

                <Link href="/calendar" className="col-span-1">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col gap-3 hover:bg-white/10 transition-colors h-full">
                        <div className="p-3 bg-pink-500/20 rounded-xl w-fit">
                            <Calendar className="w-6 h-6 text-pink-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Agenda</span>
                            <span className="text-[10px] text-white/50">Posts planejados</span>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" /> Seu Plano
                    </h2>
                    {profile.plan === 'free' && (
                        <Link href="/pricing" className="text-xs text-pink-400 font-medium">Fazer Upgrade</Link>
                    )}
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/60">Roteiros usados este mês</span>
                        <span className="font-bold">{used} / {limit < 0 ? 'Ilimitado' : limit}</span>
                    </div>
                    {limit > 0 && (
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-400" /> Últimos Gerados
                    </h2>
                    <Link href="/scripts" className="text-xs text-white/50">Ver todos</Link>
                </div>

                {recentScripts && recentScripts.length > 0 ? (
                    <div className="grid gap-3">
                        {recentScripts.map(script => (
                            <Link key={script.id} href={`/scripts/${script.id}`}>
                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-full">
                                            <Video className="w-4 h-4 text-white/70" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm line-clamp-1">{script.title}</span>
                                            <span className="text-xs text-white/40">{script.story_count} stories • {new Date(script.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-sm text-white/50">Você ainda não criou nenhum roteiro.</p>
                    </div>
                )}
            </div>
        </div >
    )
}
