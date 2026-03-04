'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Mail, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
            },
        })

        if (error) {
            toast({
                title: "Erro ao enviar",
                description: error.message,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Link enviado!",
                description: "Verifique sua caixa de entrada.",
            })
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
            },
        })
    }

    return (
        <div className="flex flex-col w-full flex-1 justify-center py-12">
            <div className="flex flex-col items-center gap-2 mb-10 text-center">
                <div className="bg-white/10 p-3 rounded-2xl mb-2">
                    <Sparkles className="w-8 h-8 text-pink-400" />
                </div>
                <h1 className="text-2xl font-bold">Bem-vindo(a) ao StoryAI</h1>
                <p className="text-white/50 text-sm">Faça login para começar a criar seus roteiros.</p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-12 bg-white text-black hover:bg-white/90 hover:text-black border-transparent font-medium"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuar com Google
                </Button>
                <Button
                    variant="outline"
                    className="w-full h-12 bg-[#000] text-white hover:bg-gray-900 hover:text-white border-white/20 font-medium"
                >
                    <Apple className="w-5 h-5 mr-2 fill-current" />
                    Continuar com Apple
                </Button>

                <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-white/40 text-xs">ou via e-mail</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                    <Input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="h-12 bg-white/5 border-white/10 focus-visible:ring-pink-500 rounded-xl"
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-white/10 text-white hover:bg-white/20 rounded-xl"
                    >
                        {loading ? 'Enviando link...' : (
                            <>
                                <Mail className="w-4 h-4 mr-2" />
                                Receber Magic Link
                            </>
                        )}
                    </Button>
                </form>
            </div>

            <p className="mt-8 text-center text-xs text-white/40 max-w-xs mx-auto">
                Ao continuar, você concorda com nossos <Link href="#" className="underline">Termos de Serviço</Link> e <Link href="#" className="underline">Política de Privacidade</Link>.
            </p>
        </div>
    )
}
