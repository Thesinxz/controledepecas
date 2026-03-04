import { createClient } from '@/app/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Sparkles, Play } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: script } = await supabase.from('scripts').select('title, niche').eq('id', params.id).single()
    return {
        title: script ? `${script.title} - StoryAI` : 'StoryAI Roteiro',
        description: script ? `Roteiro de Stories para ${script.niche}` : 'Roteiro gerado por Inteligência Artificial',
        openGraph: {
            images: ['/icons/icon-512.png']
        }
    }
}

export default async function PublicSharePage({ params }: { params: { id: string } }) {
    // Utilize service role to bypass RLS for public pages
    const supabase = await createClient()

    const { data: script, error: scriptError } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', params.id)
        .single()

    if (scriptError || !script) return notFound()

    const { data: stories } = await supabase
        .from('stories')
        .select('*')
        .eq('script_id', script.id)
        .order('position', { ascending: true })

    return (
        <div className="flex flex-col w-full max-w-md mx-auto min-h-screen p-6 pb-24 gap-6 bg-[#080810]">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-pink-500" />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    StoryAI
                </h1>
            </div>

            <div className="text-center mb-4">
                <h2 className="text-2xl font-black mb-2 leading-tight text-white">{script.title}</h2>
                <p className="text-sm text-white/50">{stories?.length || 0} stories gerados com IA</p>
            </div>

            <div className="space-y-6">
                {stories && stories.map((story) => (
                    <div key={story.id} className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
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

                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5"><Play className="w-3 h-3" /> Texto na Tela</span>
                                <p className="text-2xl font-black leading-tight text-white">
                                    {story.main_text}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5 p-4 bg-white/5 rounded-2xl border-l-2 border-purple-500">
                                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Sua Fala / Narração</span>
                                <p className="text-sm text-white/80 font-medium">
                                    "{story.narration}"
                                </p>
                            </div>

                            {(story.visual_suggestion) && (
                                <div className="text-xs text-white/50 bg-[#080810] p-3 rounded-xl border border-white/5">
                                    📹 <span className="font-medium opacity-80">Gravação:</span> {story.visual_suggestion}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#080810] from-60% to-transparent flex justify-center pb-8">
                <Link href="/" className="w-full max-w-md">
                    <button className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base rounded-2xl shadow-[0_0_30px_-5px_#ec4899] border-0">
                        Criar meu próprio Roteiro
                    </button>
                </Link>
            </div>
        </div>
    )
}
