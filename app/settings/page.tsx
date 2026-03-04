import { LogOut, User, Zap, Mail, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PushToggle } from '@/app/components/PushToggle'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex flex-col w-full gap-8 py-4 pb-24">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Ajustes</h1>
                <p className="text-sm text-white/50">Gerencie seu plano e preferências.</p>
            </div>

            <div className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold">{profile?.full_name || 'Usuário'}</span>
                    <span className="text-xs text-white/50 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user.email}</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 px-2">Assinatura</h2>
                <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">Plano Atual: {profile?.plan?.toUpperCase()}</span>
                                <span className="text-xs text-white/50">{profile?.scripts_used_this_month} / {profile?.scripts_limit} scripts usados</span>
                            </div>
                        </div>
                    </div>
                    <Link href="/pricing" className="block p-4 bg-white/[0.02] hover:bg-white/5 transition-colors text-sm text-center text-pink-400 font-medium">
                        Fazer Upgrade de Plano
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 px-2">Preferências</h2>
                <PushToggle />
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 px-2">Conta</h2>
                <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    <form action="/api/auth/signout" method="post" className="border-b border-white/5">
                        <button type="submit" className="w-full flex items-center gap-3 p-4 text-left text-sm hover:bg-white/5 transition-colors text-white/80">
                            <LogOut className="w-5 h-5 text-white/40" />
                            Sair da Conta
                        </button>
                    </form>
                    <button className="w-full flex items-center gap-3 p-4 text-left text-sm hover:bg-white/5 transition-colors text-red-400">
                        <Trash2 className="w-5 h-5 text-red-400/50" />
                        Excluir Conta
                    </button>
                </div>
            </div>
        </div>
    )
}
