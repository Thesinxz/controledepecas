import { createClient } from '@/app/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, User, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareModal } from '@/app/components/ShareModal'
import { ScheduleModal } from '@/app/components/ScheduleModal'
import { AdaptModal } from '@/app/components/AdaptModal'

export default async function ScriptDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: script, error: scriptError } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

    if (scriptError || !script) return notFound()

    const { data: stories } = await supabase
        .from('stories')
        .select('*')
        .eq('script_id', script.id)
        .order('position', { ascending: true })

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24 animate-in fade-in">
            <div className="flex items-center gap-3">
                <Link href="/scripts">
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold line-clamp-1">{script.title}</h1>
                    <p className="text-sm text-white/50">{stories?.length || 0} stories</p>
                </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-white/60">
                    <Tag className="w-3.5 h-3.5" /> <span className="font-medium">Nicho:</span> {script.niche}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                    <Calendar className="w-3.5 h-3.5" /> <span className="font-medium">Criado em:</span> {new Date(script.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                    <User className="w-3.5 h-3.5" /> <span className="font-medium">Público:</span> {script.briefing.audience}
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                    {stories && stories.length > 0 && (
                        <>
                            <div className="w-full flex gap-2">
                                <ShareModal
                                    scriptId={script.id}
                                    stories={stories}
                                />
                            </div>
                            <div className="w-full flex gap-2">
                                <ScheduleModal
                                    scriptId={script.id}
                                />
                                <AdaptModal
                                    scriptId={script.id}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    {stories && stories.map((story) => (
                        <div key={story.id} className="relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden flex flex-col">
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

                                {(story.visual_suggestion) && (
                                    <div className="flex gap-2 mt-2">
                                        <div className="flex-1 text-xs text-white/50 bg-[#080810] p-2 rounded-lg border border-white/5">
                                            📹 {story.visual_suggestion}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {(!stories || stories.length === 0) && (
                    <div className="text-center p-8 text-white/40 text-sm">
                        Nenhum story salvo para este roteiro.
                    </div>
                )}
            </div>
        </div>
    )
}
