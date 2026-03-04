'use client'

import { useState, useRef } from 'react'
import { Sparkles, Loader2, Video, Linkedin, Twitter, Copy, CheckCircle2, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
    scriptId: string
    trigger?: React.ReactNode
}

export function AdaptModal({ scriptId, trigger }: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [platform, setPlatform] = useState('tiktok')
    const [result, setResult] = useState<any>(null)
    const router = useRouter()

    const handleAdapt = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/adapt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scriptId, platform })
            })

            if (!res.ok) throw new Error('Erro ao adaptar')

            const data = await res.json()
            setResult(data.content)
            toast.success('Roteiro adaptado com sucesso!')
        } catch (e: any) {
            toast.error(e.message || 'Falha ao adaptar roteiro')
        } finally {
            setLoading(false)
        }
    }

    const copyResult = () => {
        if (!result) return
        const text = `${result.title}\n\n${result.content}\n\nDicas:\n${result.tips?.join('\n')}`
        navigator.clipboard.writeText(text)
        toast.success('Copiado para a área de transferência!')
    }

    const reset = () => {
        setResult(null)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) setTimeout(() => setResult(null), 300)
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 w-full mb-2 h-14 justify-start">
                        <Sparkles className="w-5 h-5 mr-3 text-purple-400" /> Adaptar para...
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#0c0c16] border-white/10 text-white p-0 overflow-hidden rounded-3xl max-h-[85vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 bg-white/[0.02] shrink-0 border-b border-white/5">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" /> Multirrede IA
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 p-6 overflow-y-auto min-h-0">
                    {!result ? (
                        <>
                            <p className="text-sm text-white/60 mb-2">Transforme este roteiro de Stories para outro formato usando Inteligência Artificial adaptada para as regras de cada rede.</p>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/50 uppercase">Formato de Destino</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPlatform('tiktok')}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${platform === 'tiktok' ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
                                    >
                                        <Video className="w-6 h-6" /> TikTok
                                    </button>
                                    <button
                                        onClick={() => setPlatform('reels')}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${platform === 'reels' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-pink-500/50 text-pink-400' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
                                    >
                                        <Instagram className="w-6 h-6" /> Reels
                                    </button>
                                    <button
                                        onClick={() => setPlatform('linkedin')}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${platform === 'linkedin' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
                                    >
                                        <Linkedin className="w-6 h-6" /> LinkedIn
                                    </button>
                                    <button
                                        onClick={() => setPlatform('twitter')}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${platform === 'twitter' ? 'bg-blue-400/20 border-blue-400/50 text-blue-300' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
                                    >
                                        <Twitter className="w-6 h-6" /> Twitter/X
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleAdapt}
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold mt-4"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Gerar Adaptação'}
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={copyResult}
                                    className="absolute top-3 right-3 h-8 w-8 text-white/50 hover:text-white bg-white/5"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <h3 className="font-bold text-lg mb-2 pr-10">{result.title}</h3>
                                <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{result.content}</div>

                                {result.tips && result.tips.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Dicas da IA
                                        </h4>
                                        <ul className="list-disc pl-4 text-xs text-white/60 space-y-1">
                                            {result.tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={reset}
                                variant="outline"
                                className="w-full text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Fechar
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
