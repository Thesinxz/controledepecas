'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Sparkles, AlertCircle, Copy, Share, ChevronLeft, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoryElement } from '@/app/types/ai'
import Link from 'next/link'
import { ShareModal } from '@/app/components/ShareModal'

export default function ResultPage() {
    const router = useRouter()
    const [status, setStatus] = useState('Iniciando IA...')
    const [step, setStep] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [scriptId, setScriptId] = useState<string | null>(null)
    const [stories, setStories] = useState<StoryElement[]>([])
    const [briefing, setBriefing] = useState<any>(null)
    const [done, setDone] = useState(false)

    useEffect(() => {
        const draftStr = sessionStorage.getItem('storyai_draft')
        if (!draftStr) {
            router.push('/create')
            return
        }

        const startGeneration = async () => {
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: draftStr
                })

                if (!response.ok || !response.body) {
                    const err = await response.json()
                    throw new Error(err.error || 'Falha ao conectar na API')
                }

                const reader = response.body.getReader()
                const decoder = new TextDecoder()

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value, { stream: true })
                    const lines = chunk.split('\n')

                    let currentEvent = ''
                    for (const line of lines) {
                        if (line.startsWith('event: ')) {
                            currentEvent = line.replace('event: ', '').trim()
                        } else if (line.startsWith('data: ')) {
                            const dataStr = line.replace('data: ', '').trim()
                            if (!dataStr) continue

                            const data = JSON.parse(dataStr)

                            if (currentEvent === 'progress') {
                                setStep(data.step)
                                setStatus(data.status)
                            } else if (currentEvent === 'complete') {
                                setScriptId(data.script_id)
                                setStories(data.data?.stories || [])
                                setBriefing(data.briefing)
                                setDone(true)
                                setStatus('Roteiro pronto!')
                                setStep(6)
                                sessionStorage.removeItem('storyai_draft')
                            } else if (currentEvent === 'error') {
                                throw new Error(data.message)
                            }
                        }
                    }
                }
            } catch (err: any) {
                setError(err.message)
                setStatus('Geração falhou')
            }
        }

        startGeneration()
    }, [router])

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24 animate-in fade-in">
            <div className="flex items-center gap-3">
                {done && (
                    <Link href="/create">
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                )}
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        {!done ? 'Criando a Mágica' : 'Roteiro Gerado'}
                    </h1>
                    <p className="text-sm text-white/50">
                        {!done ? 'Aguarde enquanto os agentes trabalham.' : 'Pronto para gravar e postar.'}
                    </p>
                </div>
            </div>

            {!done && !error && (
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/5 my-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 blur-xl opacity-40 animate-pulse rounded-full" />
                        <div className="w-24 h-24 bg-[#0c0c16] rounded-full flex items-center justify-center relative z-10 border border-white/10">
                            <Sparkles className="w-10 h-10 text-pink-400 animate-bounce" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-6 mb-2">{status}</h2>
                    <div className="w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-white/40 mt-4 text-center">Geralmente leva cerca de 15 a 30 segundos.</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-3xl my-8 text-center text-red-500">
                    <AlertCircle className="w-12 h-12 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
                    <p className="text-sm opacity-80 mb-6">{error}</p>
                    <Link href="/create">
                        <Button className="bg-red-500 text-white hover:bg-red-600">Voltar e Tentar Novamente</Button>
                    </Link>
                </div>
            )}

            {done && stories.length > 0 && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex gap-2">
                        {scriptId && (
                            <ShareModal
                                scriptId={scriptId}
                                stories={stories}
                                trigger={
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl h-12">
                                        <Share className="w-4 h-4 mr-2" /> Compartilhar e Exportar
                                    </Button>
                                }
                            />
                        )}
                    </div>

                    {briefing && (
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-pink-400" />
                                <h2 className="text-lg font-bold">Insights Estratégicos</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(briefing).map(([key, value]: [string, any]) => {
                                    if (typeof value !== 'string') return null
                                    return (
                                        <div key={key} className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{key.replace('_', ' ')}</span>
                                            <p className="text-sm text-white/80 leading-relaxed">{value}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {stories.map((story, i) => (
                            <div key={i} className="relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-pink-500/10 to-transparent">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                                            {story.position}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                                            {story.type === 'hook' ? 'Gancho' : story.type === 'cta' ? 'Call to Action' : 'Conteúdo'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-white/40">{story.duration_seconds}s</span>
                                </div>

                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Texto na Tela</span>
                                        <p className="text-2xl font-black leading-tight text-white !drop-shadow-md">
                                            {story.main_text}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border-l-2 border-purple-500">
                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Sua Fala / Narração</span>
                                        <p className="text-sm text-white/80 font-medium">
                                            "{story.narration}"
                                        </p>
                                    </div>

                                    {(story.visual_suggestion || story.sticker_suggestion) && (
                                        <div className="flex gap-2 mt-2">
                                            {story.visual_suggestion && (
                                                <div className="flex-1 text-xs text-white/50 bg-[#080810] p-2 rounded-lg border border-white/5">
                                                    📹 {story.visual_suggestion}
                                                </div>
                                            )}
                                            {story.sticker_suggestion && (
                                                <div className="flex-1 text-xs text-white/50 bg-[#080810] p-2 rounded-lg border border-white/5">
                                                    ✨ {story.sticker_suggestion}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <Button
                            className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base rounded-2xl shadow-[0_0_30px_-5px_#ec4899] border-0"
                            onClick={() => router.push(`/scripts/${scriptId}`)}
                        >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Ver Roteiro Salvo
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl"
                            onClick={() => router.push('/create')}
                        >
                            Criar Outro Roteiro
                        </Button>
                    </div>
                </div>
            )
            }
        </div >
    )
}
