import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch a single script with its stories
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: script, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

    if (error || !script) return new NextResponse('Not Found', { status: 404 })

    const { data: stories } = await supabase
        .from('stories')
        .select('*')
        .eq('script_id', script.id)
        .order('position', { ascending: true })

    return NextResponse.json({ script, stories })
}

// PATCH - Update script title, niche, tone etc.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json()

    // Only allow updating certain fields
    const allowedFields = ['title', 'niche', 'goal', 'tone', 'product', 'status']
    const updateData: Record<string, any> = {}
    for (const key of allowedFields) {
        if (body[key] !== undefined) {
            updateData[key] = body[key]
        }
    }
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
        .from('scripts')
        .update(updateData)
        .eq('id', params.id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json(data)
}

// DELETE - Delete a script and all related stories (cascade)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Delete script error:', error)
        return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
