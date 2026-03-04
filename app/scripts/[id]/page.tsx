import { createClient } from '@/app/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, User, Calendar, Tag, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareModal } from '@/app/components/ShareModal'
import { ScheduleModal } from '@/app/components/ScheduleModal'
import { AdaptModal } from '@/app/components/AdaptModal'
import { ScriptActions } from '@/app/components/ScriptActions'
import { StoryCard } from '@/app/components/StoryCard'

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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/scripts">
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold line-clamp-1">{script.title}</h1>
                        <p className="text-sm text-white/50">{stories?.length || 0} stories • {script.status === 'completed' ? 'Completo' : 'Rascunho'}</p>
                    </div>
                </div>
                <ScriptActions scriptId={script.id} scriptTitle={script.title} />
            </div>

            {/* Script Metadata */}
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-white/60">
                    <Tag className="w-3.5 h-3.5" /> <span className="font-medium">Nicho:</span> {script.niche}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                    <Calendar className="w-3.5 h-3.5" /> <span className="font-medium">Criado em:</span> {new Date(script.created_at).toLocaleDateString('pt-BR')}
                </div>
                {script.briefing?.audience && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                        <User className="w-3.5 h-3.5" /> <span className="font-medium">Público:</span> {script.briefing?.audience}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {stories && stories.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <ShareModal scriptId={script.id} stories={stories} />
                        <Link href={`/editor/${script.id}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none text-white font-bold h-14 rounded-2xl">
                                <Sparkles className="w-5 h-5 mr-2" /> Estúdio Visual
                            </Button>
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        <ScheduleModal scriptId={script.id} />
                        <AdaptModal scriptId={script.id} />
                    </div>
                </div>
            )}

            {/* Strategic Insights */}
            {script.briefing && (
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-pink-400" />
                        <h2 className="text-base font-bold">Insights Estratégicos</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(script.briefing).map(([key, value]: [string, any]) => {
                            if (typeof value !== 'string') return null
                            return (
                                <div key={key} className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                                    <p className="text-sm text-white/80 leading-relaxed">{value}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Stories List (Editable) */}
            <div className="space-y-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{stories?.length || 0}</span>
                    Cenas do Roteiro
                </h2>
                {stories && stories.map((story: any) => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>

            {(!stories || stories.length === 0) && (
                <div className="text-center p-8 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
                    Nenhum story salvo para este roteiro. Os stories podem não ter sido salvos corretamente durante a geração.
                </div>
            )}
        </div>
    )
}
