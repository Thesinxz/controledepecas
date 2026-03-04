'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, Menu, BarChart3, Calendar, History, Settings, LayoutTemplate, ShieldCheck, User, LogOut } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [profile, setProfile] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
        }
        loadProfile()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#080810]/80 backdrop-blur-md border-b border-white/10 z-[60] flex items-center justify-center">
            <div className="w-full max-w-md px-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-pink-500 to-purple-600 p-1.5 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        StoryAI
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0c0c16] border-white/10 text-white min-w-[220px] rounded-2xl p-2">
                            <DropdownMenuLabel className="px-3 py-2">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Navegação</span>
                            </DropdownMenuLabel>

                            <Link href="/analytics">
                                <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 text-sm">
                                    <BarChart3 className="w-4 h-4 text-blue-400" /> Analytics & Ganhos
                                </DropdownMenuItem>
                            </Link>

                            <Link href="/calendar">
                                <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 text-sm">
                                    <Calendar className="w-4 h-4 text-pink-400" /> Agenda de Posts
                                </DropdownMenuItem>
                            </Link>

                            <Link href="/scripts">
                                <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 text-sm">
                                    <History className="w-4 h-4 text-purple-400" /> Histórico de Roteiros
                                </DropdownMenuItem>
                            </Link>

                            <Link href="/templates">
                                <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 text-sm">
                                    <LayoutTemplate className="w-4 h-4 text-yellow-500" /> Modelos Prontos
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuSeparator className="bg-white/5 my-1" />

                            <DropdownMenuLabel className="px-3 py-2">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Conta</span>
                            </DropdownMenuLabel>

                            {profile?.is_admin && (
                                <Link href="/admin">
                                    <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 text-sm font-bold text-red-400">
                                        <ShieldCheck className="w-4 h-4" /> Painel Admin
                                    </DropdownMenuItem>
                                </Link>
                            )}

                            <Link href="/settings">
                                <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 text-sm">
                                    <Settings className="w-4 h-4 text-white/40" /> Configurações
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem onClick={handleSignOut} className="gap-3 py-2.5 cursor-pointer rounded-xl hover:bg-red-500/10 focus:bg-red-500/10 text-sm text-red-500">
                                <LogOut className="w-4 h-4" /> Sair da Conta
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
