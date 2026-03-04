'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/app/lib/supabase/client'
import { StoryElement } from '@/app/types/ai'
import { StoryPreview } from '@/app/components/editor/StoryPreview'
import { EditorSidebar } from '@/app/components/editor/EditorSidebar'
import { toast } from 'sonner'
import Link from 'next/link'

export default function VisualEditorPage({ params }: { params: { id: string } }) {
    const [script, setScript] = useState<any>(null)
    const [stories, setStories] = useState<any[]>([])
    const [selectedStoryIdx, setSelectedStoryIdx] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [visuals, setVisuals] = useState<any>({
        background_type: 'solid',
        background_color: '#080810',
        background_gradient: '',
        text_color: '#FFFFFF',
        font_size: 40,
        font_family: 'System',
        text_position: 'center'
    })

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                // Fetch Script
                const { data: scriptData } = await supabase
                    .from('scripts')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (!scriptData) {
                    router.push('/dashboard')
                    return
                }

                setScript(scriptData)

                // Fetch Stories
                const { data: storiesData } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('script_id', params.id)
                    .order('position', { ascending: true })

                setStories(storiesData || [])

                // Fetch Visuals for first story
                if (storiesData && storiesData.length > 0) {
                    await fetchVisuals(storiesData[0].id)
                }

            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [params.id])

    const fetchVisuals = async (storyId: string) => {
        const res = await fetch(`/api/visuals/${storyId}`)
        if (res.ok) {
            const data = await res.json()
            if (data) {
                setVisuals(data)
            } else {
                // Reset to defaults if no visuals saved
                setVisuals({
                    background_type: 'solid',
                    background_color: '#080810',
                    background_gradient: '',
                    text_color: '#FFFFFF',
                    font_size: 40,
                    font_family: 'System',
                    text_position: 'center'
                })
            }
        }
    }

    const handleStorySelect = async (idx: number) => {
        setSelectedStoryIdx(idx)
        await fetchVisuals(stories[idx].id)
    }

    const saveVisuals = async () => {
        try {
            setSaving(true)
            const currentStory = stories[selectedStoryIdx]
            const res = await fetch(`/api/visuals/${currentStory.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visuals)
            })

            if (!res.ok) throw new Error('Erro ao salvar')

            toast.success('Alterações visuais salvas!')
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                <p className="text-sm text-white/50">Carregando estúdio...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#080810] -mx-6 px-6">
            <div className="flex items-center justify-between py-4 border-b border-white/5 bg-[#080810] sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href={`/scripts/${params.id}`}>
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold">Editor Visual</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Personalize seus stories</p>
                    </div>
                </div>
                <Button
                    onClick={saveVisuals}
                    disabled={saving}
                    className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-bold flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar
                </Button>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 py-8">
                {/* Preview Column */}
                <div className="lg:col-span-5 flex flex-col items-center gap-6">
                    <div className="w-full max-w-[340px]">
                        <StoryPreview story={stories[selectedStoryIdx]} visuals={visuals} />
                    </div>
                </div>

                {/* Controls Column */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Selecionar Cena ({stories.length})</span>
                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                            {stories.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStorySelect(i)}
                                    className={`shrink-0 w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center font-bold snap-start ${selectedStoryIdx === i ? 'bg-pink-500 border-white text-white scale-110 shadow-[0_0_15px_-3px_#ec4899]' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                                >
                                    {s.position}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                        <EditorSidebar visuals={visuals} setVisuals={setVisuals} />
                    </div>
                </div>
            </div>

            {/* Footer Mobile Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#080810] to-transparent z-40 lg:hidden">
                <Button
                    onClick={saveVisuals}
                    disabled={saving}
                    className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-black text-lg rounded-2xl shadow-[0_0_30px_-5px_#ec4899]"
                >
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 mr-3" />}
                    Salvar Design do Story {stories[selectedStoryIdx].position}
                </Button>
            </div>
        </div>
    )
}
