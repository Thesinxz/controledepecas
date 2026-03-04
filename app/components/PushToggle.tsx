'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function PushToggle() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [support, setSupport] = useState(false)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setSupport(true)
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg?.pushManager) {
                    reg.pushManager.getSubscription().then(sub => {
                        setIsSubscribed(!!sub)
                    })
                }
            })
        }
    }, [])

    const subscribe = async () => {
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
            toast.error('Push API mal configurada')
            return
        }

        setIsLoading(true)
        try {
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
                throw new Error('Permissão negada')
            }

            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            })

            const res = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription })
            })

            if (!res.ok) throw new Error('Erro do servidor')

            setIsSubscribed(true)
            toast.success('Notificações ativadas!')
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || 'Falha ao ativar notificações')
        } finally {
            setIsLoading(false)
        }
    }

    const unsubscribe = async () => {
        setIsLoading(true)
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            if (subscription) {
                await subscription.unsubscribe()
            }
            setIsSubscribed(false)
            toast.success('Notificações desativadas')
        } catch (e) {
            toast.error('Erro ao desativar notificações')
        } finally {
            setIsLoading(false)
        }
    }

    if (!support) return null

    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isSubscribed ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/50'}`}>
                    {isSubscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-sm">Notificações Push</span>
                    <span className="text-xs text-white/50">{isSubscribed ? 'Recebendo alertas importantes' : 'Ative para alertas de roteiros'}</span>
                </div>
            </div>
            <Button
                variant={isSubscribed ? "secondary" : "default"}
                size="sm"
                onClick={isSubscribed ? unsubscribe : subscribe}
                disabled={isLoading}
                className={!isSubscribed ? "bg-pink-500 hover:bg-pink-600 text-white text-xs" : "bg-white/10 hover:bg-white/20 text-white text-xs"}
            >
                {isLoading && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                {isSubscribed ? 'Desativar' : 'Ativar'}
            </Button>
        </div>
    )
}
