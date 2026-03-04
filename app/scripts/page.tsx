import Link from 'next/link'
import { FileText, Calendar, ChevronRight } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ScriptsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: scripts } = await supabase
        .from('scripts')
        .select('id, title, niche, story_count, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-400" />
                    Seus Roteiros
                </h1>
                <p className="text-sm text-white/50">Todo o seu histórico de criações fica salvo aqui.</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
                {scripts && scripts.length > 0 ? scripts.map(script => (
                    <Link key={script.id} href={`/scripts/${script.id}`}>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-xl">
                                <FileText className="w-6 h-6 text-white/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{script.title}</h3>
                                <div className="flex items-center gap-3 mt-1.5 opacity-60 text-xs">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(script.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{script.story_count} stories</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/30" />
                        </div>
                    </Link>
                )) : (
                    <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-sm text-white/50">Nenhum roteiro gerado ainda.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
