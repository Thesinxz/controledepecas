'use client'

import { useOnlineStatus } from '@/app/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
    const isOnline = useOnlineStatus()

    if (isOnline) return null

    return (
        <div className="fixed top-16 left-0 right-0 z-[60] animate-in slide-in-from-top duration-300">
            <div className="mx-4 bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-3 shadow-lg border border-white/20">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-bold">Você está offline. Algumas funções podem não funcionar.</span>
            </div>
        </div>
    )
}
