import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(req: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return new NextResponse('Forbidden', { status: 403 })

    const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30)

    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json(data)
}
