import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { format, subDays } from 'date-fns'

export async function GET(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

        // Daily Scripts
        const { data: scripts, error: scriptsError } = await supabase
            .from('scripts')
            .select('created_at, story_count')
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo)

        if (scriptsError) throw scriptsError

        // Group by day for LineChart
        const scriptCounts: Record<string, number> = {}
        const storyCounts: Record<string, number> = {}

        for (let i = 29; i >= 0; i--) {
            const d = format(subDays(new Date(), i), 'MMM dd')
            scriptCounts[d] = 0
            storyCounts[d] = 0
        }

        scripts?.forEach(s => {
            const d = format(new Date(s.created_at), 'MMM dd')
            if (scriptCounts[d] !== undefined) {
                scriptCounts[d] += 1
                storyCounts[d] += s.story_count || 0
            }
        })

        const lineChartData = Object.keys(scriptCounts).map(date => ({
            date,
            scripts: scriptCounts[date],
            stories: storyCounts[date]
        }))

        // Niches
        const { data: nichesRaw } = await supabase
            .from('scripts')
            .select('niche')
            .eq('user_id', user.id)

        const nicheCounts: Record<string, number> = {}
        nichesRaw?.forEach(n => {
            const key = n.niche || 'Outro'
            nicheCounts[key] = (nicheCounts[key] || 0) + 1
        })

        const nicheData = Object.entries(nicheCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)

        return NextResponse.json({
            lineChartData,
            nicheData,
            totalScripts: scripts?.length || 0,
            totalStories: scripts?.reduce((acc, curr) => acc + (curr.story_count || 0), 0) || 0
        })

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
