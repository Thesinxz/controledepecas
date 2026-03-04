'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Calendar, ChevronRight, Trash2, Loader2, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Script {
    id: string
    title: string
    niche: string
    story_count: number
    created_at: string
    status: string
}

interface Props {
    scripts: Script[]
}

export function ScriptsList({ scripts: initialScripts }: Props) {
    const router = useRouter()
    const [scripts, setScripts] = useState(initialScripts)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (e: React.MouseEvent, scriptId: string) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('Excluir este roteiro? Esta ação é irreversível.')) return

        setDeletingId(scriptId)
        try {
            const res = await fetch(`/api/scripts/${scriptId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Falha ao excluir')
            setScripts(prev => prev.filter(s => s.id !== scriptId))
            toast.success('Roteiro excluído!')
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setDeletingId(null)
        }
    }

    if (scripts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-12 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                <FileText className="w-12 h-12 text-white/20" />
                <p className="text-sm text-white/50">Nenhum roteiro gerado ainda.</p>
                <Link href="/create">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl h-12 px-6">
                        <PlusCircle className="w-5 h-5 mr-2" /> Criar Primeiro Roteiro
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {scripts.map(script => (
                <Link key={script.id} href={`/scripts/${script.id}`}>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-xl">
                            <FileText className="w-6 h-6 text-white/70" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{script.title}</h3>
                            <div className="flex items-center gap-3 mt-1.5 opacity-60 text-xs">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(script.created_at).toLocaleDateString('pt-BR')}
                                </span>
                                <span>•</span>
                                <span>{script.story_count} stories</span>
                                {script.niche && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate max-w-[80px]">{script.niche}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => handleDelete(e, script.id)}
                                disabled={deletingId === script.id}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                {deletingId === script.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                            <ChevronRight className="w-5 h-5 text-white/30" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
