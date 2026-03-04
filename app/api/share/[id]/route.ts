import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request, { params }: { params: { id: string } }) {
    // Service role bypasses RLS to allow public sharing
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: script } = await supabase.from('scripts').select('*').eq('id', params.id).single()
    const { data: stories } = await supabase.from('stories').select('*').eq('script_id', params.id).order('position', { ascending: true })

    if (!script) return new NextResponse('Not found', { status: 404 })

    return NextResponse.json({ script, stories })
}
