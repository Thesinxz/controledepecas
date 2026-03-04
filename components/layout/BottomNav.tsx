'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, LayoutTemplate, Settings } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    // Don't show on public landing pages or specific routes
    const hiddenRoutes = ['/', '/login', '/onboarding', '/pricing']
    if (hiddenRoutes.includes(pathname) || pathname.startsWith('/api')) {
        return null
    }

    const navItems = [
        { name: 'Início', href: '/dashboard', icon: Home },
        { name: 'Modelos', href: '/templates', icon: LayoutTemplate },
        { name: 'Criar', href: '/create', icon: PlusCircle, highlight: true },
        { name: 'Ajustes', href: '/settings', icon: Settings },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0c0c16]/90 backdrop-blur-lg border-t border-white/5 z-50 pb-[env(safe-area-inset-bottom)]">
            <div className="w-full max-w-md mx-auto h-full px-6 flex items-center justify-between">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href) && item.href !== '/'
                    const Icon = item.icon

                    if (item.highlight) {
                        return (
                            <Link key={item.name} href={item.href} className="relative -top-5 flex flex-col items-center">
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full shadow-lg shadow-purple-500/20">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-[10px] mt-1 text-white/70 font-medium">{item.name}</span>
                            </Link>
                        )
                    }

                    return (
                        <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1.5 min-w-[64px]">
                            <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-purple-400' : 'text-white/40'}`} />
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-purple-400' : 'text-white/40'}`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
