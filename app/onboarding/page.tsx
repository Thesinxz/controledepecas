'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/app/lib/supabase/client'
import { ArrowRight, Check } from 'lucide-react'

const niches = [
    'Marketing e Vendas', 'Desenvolvimento Pessoal', 'Saúde e Fitness',
    'Beleza e Estética', 'Moda', 'Finanças', 'Gastronomia', 'Educação'
]

const tones = [
    { id: 'informal', label: 'Descontraído', emoji: '😎' },
    { id: 'professional', label: 'Profissional', emoji: '💼' },
    { id: 'energetic', label: 'Enérgico', emoji: '⚡' },
    { id: 'educational', label: 'Educativo', emoji: '📚' }
]

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [niche, setNiche] = useState('')
    const [tone, setTone] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleComplete = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase.from('profiles').update({
                niche,
                default_tone: tone,
                onboarding_completed: true
            }).eq('id', user.id)
        }

        router.push('/create')
    }

    return (
        <div className="flex flex-col flex-1 w-full max-w-sm mx-auto justify-center py-8 animate-in fade-in duration-500">
            <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-pink-500' : 'bg-white/10'}`} />
                ))}
            </div>

            {step === 1 && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-right-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Qual o seu nicho?</h1>
                        <p className="text-white/50 text-sm">Isso ajuda a IA a entender o seu público-alvo inicial.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {niches.map((n) => (
                            <button
                                key={n}
                                onClick={() => setNiche(n)}
                                className={`p-4 rounded-2xl text-sm font-medium transition-all text-left border ${niche === n ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10'
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <Button
                        disabled={!niche}
                        onClick={() => setStep(2)}
                        className="w-full h-14 mt-4 bg-white text-black hover:bg-white/90 text-base"
                    >
                        Continuar <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-right-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Seu tom de voz</h1>
                        <p className="text-white/50 text-sm">Como você costuma falar com seus seguidores?</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {tones.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTone(t.id)}
                                className={`flex items-center gap-4 p-5 rounded-2xl transition-all border ${tone === t.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-2xl">{t.emoji}</span>
                                <span className={`font-semibold ${tone === t.id ? 'text-white' : 'text-white/70'}`}>{t.label}</span>
                                {tone === t.id && <Check className="w-5 h-5 text-purple-400 ml-auto" />}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Button variant="outline" onClick={() => setStep(1)} className="h-14 bg-transparent border-white/10 text-white">
                            Voltar
                        </Button>
                        <Button
                            disabled={!tone}
                            onClick={() => setStep(3)}
                            className="flex-1 h-14 bg-white text-black hover:bg-white/90 text-base"
                        >
                            Continuar <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center text-center gap-6 animate-in zoom-in-95">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Tudo pronto!</h1>
                    <p className="text-white/50 text-sm">Seu perfil foi configurado. Agora você já pode criar o seu primeiro roteiro de alta conversão.</p>

                    <Button
                        onClick={handleComplete}
                        disabled={loading}
                        className="w-full h-14 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-base shadow-[0_0_30px_-5px_#ec4899] border-0"
                    >
                        {loading ? 'Preparando o app...' : 'Criar meu primeiro roteiro'}
                    </Button>
                </div>
            )}
        </div>
    )
}
