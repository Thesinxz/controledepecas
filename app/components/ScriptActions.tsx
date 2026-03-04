'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Pencil, Trash2, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Props {
    scriptId: string
    scriptTitle: string
}

export function ScriptActions({ scriptId, scriptTitle }: Props) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [editTitle, setEditTitle] = useState(scriptTitle)
    const [isSaving, setIsSaving] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/scripts/${scriptId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Falha ao excluir')
            toast.success('Roteiro excluído com sucesso!')
            router.push('/scripts')
            router.refresh()
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    const handleEditTitle = async () => {
        if (!editTitle.trim()) return
        setIsSaving(true)
        try {
            const res = await fetch(`/api/scripts/${scriptId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle.trim() })
            })
            if (!res.ok) throw new Error('Falha ao salvar')
            toast.success('Título atualizado!')
            router.refresh()
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setIsSaving(false)
            setShowEditDialog(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0c0c16] border-white/10 text-white min-w-[180px]">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="gap-2 cursor-pointer focus:bg-white/10 focus:text-white">
                        <Pencil className="w-4 h-4" />
                        Editar Título
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="gap-2 cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400">
                        <Trash2 className="w-4 h-4" />
                        Excluir Roteiro
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-[#0c0c16] border-white/10 text-white max-w-sm mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Excluir Roteiro?</DialogTitle>
                        <DialogDescription className="text-white/50">
                            Esta ação é irreversível. Todos os stories, agendamentos e adaptações ligados a este roteiro serão removidos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(false)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Title Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="bg-[#0c0c16] border-white/10 text-white max-w-sm mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Editar Título</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                        placeholder="Nome do roteiro..."
                    />
                    <DialogFooter className="flex gap-2 sm:gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setShowEditDialog(false)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditTitle}
                            disabled={isSaving || !editTitle.trim()}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
