'use client'

import { useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Props {
    story: {
        id: string
        position: number
        type: string
        main_text: string
        narration: string
        visual_suggestion?: string
        sticker_suggestion?: string
        duration_seconds: number
        background_color?: string
    }
}

export function StoryCard({ story }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [mainText, setMainText] = useState(story.main_text)
    const [narration, setNarration] = useState(story.narration)
    const [visualSuggestion, setVisualSuggestion] = useState(story.visual_suggestion || '')

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/stories/${story.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    main_text: mainText,
                    narration: narration,
                    visual_suggestion: visualSuggestion
                })
            })
            if (!res.ok) throw new Error('Falha ao salvar')
            toast.success(`Story ${story.position} atualizado!`)
            setIsEditing(false)
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setMainText(story.main_text)
        setNarration(story.narration)
        setVisualSuggestion(story.visual_suggestion || '')
        setIsEditing(false)
    }

    const typeLabel = {
        hook: 'Gancho',
        content: 'Conteúdo',
        proof: 'Prova Social',
        question: 'Pergunta',
        cta: 'Call to Action',
        transition: 'Transição'
    }[story.type] || 'Conteúdo'

    return (
        <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-pink-500/10 to-transparent">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {story.position}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                        {typeLabel}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/40">{story.duration_seconds}s</span>
                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                    ) : (
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                                disabled={saving}
                                className="w-8 h-8 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400"
                            >
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-4">
                {/* Main Text */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Texto na Tela</span>
                    {isEditing ? (
                        <Textarea
                            value={mainText}
                            onChange={(e) => setMainText(e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-lg font-bold rounded-xl resize-none min-h-[60px]"
                        />
                    ) : (
                        <p className="text-2xl font-black leading-tight text-white !drop-shadow-md">
                            {mainText}
                        </p>
                    )}
                </div>

                {/* Narration */}
                <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border-l-2 border-purple-500">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Sua Fala / Narração</span>
                    {isEditing ? (
                        <Textarea
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm rounded-xl resize-none min-h-[80px]"
                        />
                    ) : (
                        <p className="text-sm text-white/80 font-medium">
                            &ldquo;{narration}&rdquo;
                        </p>
                    )}
                </div>

                {/* Visual Suggestion */}
                {(visualSuggestion || isEditing) && (
                    <div className="flex flex-col gap-1">
                        {isEditing ? (
                            <>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sugestão Visual</span>
                                <Textarea
                                    value={visualSuggestion}
                                    onChange={(e) => setVisualSuggestion(e.target.value)}
                                    placeholder="Ex: Selfie falando, Produto no fundo..."
                                    className="bg-white/5 border-white/10 text-white text-xs rounded-xl resize-none min-h-[50px]"
                                />
                            </>
                        ) : (
                            <div className="flex-1 text-xs text-white/50 bg-[#080810] p-2 rounded-lg border border-white/5">
                                📹 {visualSuggestion}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
