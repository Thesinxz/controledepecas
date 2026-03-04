import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(req: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return new NextResponse('Forbidden', { status: 403 })

    const url = new URL(req.url)
    const limit = Number(url.searchParams.get('limit')) || 50
    const search = url.searchParams.get('q') || ''

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json(data)
}
