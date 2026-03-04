import Link from 'next/link'
import { FileText, PlusCircle } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScriptsList } from '@/app/components/ScriptsList'

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
        <div className="flex flex-col w-full gap-6 py-4 pb-24 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-purple-400" />
                        Seus Roteiros
                    </h1>
                    <p className="text-sm text-white/50">
                        {scripts?.length || 0} roteiro{(scripts?.length || 0) !== 1 ? 's' : ''} salvo{(scripts?.length || 0) !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/create">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl h-10 px-4 text-sm">
                        <PlusCircle className="w-4 h-4 mr-1.5" /> Novo
                    </Button>
                </Link>
            </div>

            <ScriptsList scripts={scripts || []} />
        </div>
    )
}
