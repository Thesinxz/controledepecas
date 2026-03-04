import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Activity, Settings, ChevronLeft } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()

    if (!profile?.is_admin) {
        redirect('/dashboard') // Or throw a 403 Not Authorized
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#080810]">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </Link>
                    <h1 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-pink-500" />
                        Admin Panel
                    </h1>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Desktop Sidebar / Mobile Top Nav */}
                <div className="hidden md:flex flex-col w-64 border-r border-white/5 p-4 gap-2 bg-white/[0.01]">
                    <Link href="/admin">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-white/50" /> Overview
                        </div>
                    </Link>
                    <Link href="/admin/users">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors">
                            <Users className="w-4 h-4 text-white/50" /> Usuários
                        </div>
                    </Link>
                    <Link href="/settings">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors">
                            <Settings className="w-4 h-4 text-white/50" /> Configurações App
                        </div>
                    </Link>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex w-full border-b border-white/5 p-2 gap-2 bg-white/[0.01] overflow-x-auto snap-x">
                    <Link href="/admin" className="snap-start shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-xs font-medium">
                            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                        </div>
                    </Link>
                    <Link href="/admin/users" className="snap-start shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-xs font-medium text-white/60">
                            <Users className="w-3.5 h-3.5" /> Usuários
                        </div>
                    </Link>
                </div>

                <div className="flex-1 p-6 pb-24">
                    {children}
                </div>
            </div>
        </div>
    )
}
