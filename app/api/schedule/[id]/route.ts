import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const { error } = await supabase
            .from('scheduled_posts')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) throw error

        return new NextResponse('Deleted successfully', { status: 200 })
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
