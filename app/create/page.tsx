'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreatePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        niche: '',
        goal: '',
        audience: '',
        tone: 'informal',
        product: '',
        story_count: 5
    })

    const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        sessionStorage.setItem('storyai_draft', JSON.stringify(form))
        router.push('/create/result')
    }

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    Criar Roteiro
                </h1>
                <p className="text-sm text-white/50">Preencha o briefing para a IA gerar suas histórias.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                    <Label className="text-white/80">O que você vai vender/promover hoje?</Label>
                    <Input
                        required
                        placeholder="Ex: Consultoria de Vendas, Tênis Nike, Imersão..."
                        value={form.product}
                        onChange={e => handleChange('product', e.target.value)}
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80">Qual o objetivo principal?</Label>
                    <Select value={form.goal} onValueChange={v => handleChange('goal', v)} required>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-pink-500 text-white">
                            <SelectValue placeholder="Selecione um objetivo" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c0c16] border-white/10 text-white">
                            <SelectItem value="venda">Venda Direta</SelectItem>
                            <SelectItem value="lead">Captura de Lead / Link na Bio</SelectItem>
                            <SelectItem value="engajamento">Engajamento (Enquetes, Caixinha)</SelectItem>
                            <SelectItem value="autoridade">Gerar Autoridade / Storytelling</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-white/80">Seu Nicho</Label>
                        <Input
                            required
                            placeholder="Ex: Marketing"
                            value={form.niche}
                            onChange={e => handleChange('niche', e.target.value)}
                            className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-pink-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white/80">Tom de voz</Label>
                        <Select value={form.tone} onValueChange={v => handleChange('tone', v)}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-pink-500 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0c0c16] border-white/10 text-white">
                                <SelectItem value="informal">Informal 😎</SelectItem>
                                <SelectItem value="professional">Profissional 💼</SelectItem>
                                <SelectItem value="energetic">Enérgico ⚡</SelectItem>
                                <SelectItem value="educational">Educativo 📚</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80">Quem é seu público alvo?</Label>
                    <Textarea
                        placeholder="Ex: Empreendedores que querem vender mais pelo Instagram..."
                        value={form.audience}
                        onChange={e => handleChange('audience', e.target.value)}
                        className="bg-white/5 border-white/10 min-h-[100px] rounded-xl focus-visible:ring-pink-500 resize-none p-3"
                    />
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-white/80">Quantidade de Stories</Label>
                        <span className="font-bold text-pink-400">{form.story_count} stories</span>
                    </div>
                    <Slider
                        value={[form.story_count]}
                        onValueChange={v => handleChange('story_count', v[0])}
                        max={15}
                        min={3}
                        step={1}
                        className="[&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500"
                    />
                    <p className="text-xs text-white/40 text-center">Duração aproximada: {form.story_count * 7} segundos de vídeo.</p>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base rounded-xl shadow-[0_0_30px_-5px_#ec4899] border-0"
                >
                    {loading ? 'Preparando...' : 'Gerar Roteiro com IA'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </form>
        </div>
    )
}
