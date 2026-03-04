import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarView from '@/app/components/CalendarView'

export default async function CalendarPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: scheduledPosts } = await supabase
        .from('scheduled_posts')
        .select(`
            *,
            scripts(id, title)
        `)
        .eq('user_id', user.id)
        .order('scheduled_for', { ascending: true })

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Calendário de Conteúdo</h1>
                <p className="text-sm text-white/50">Veja seus roteiros agendados e programe suas postagens.</p>
            </div>

            <CalendarView initialPosts={scheduledPosts || []} />
        </div>
    )
}
