'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Props {
    scriptId: string
    trigger?: React.ReactNode
}

export function ScheduleModal({ scriptId, trigger }: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [platform, setPlatform] = useState('instagram')

    const handleSchedule = async () => {
        if (!date || !time) {
            toast.error('Preencha data e hora')
            return
        }

        try {
            setLoading(true)
            const scheduled_for = new Date(`${date}T${time}:00`).toISOString()

            const res = await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scriptId, platform, scheduled_for })
            })

            if (!res.ok) throw new Error('Erro ao agendar')

            toast.success('Roteiro agendado com sucesso!')
            setOpen(false)
        } catch (e: any) {
            toast.error(e.message || 'Falha ao agendar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 w-full mb-2 h-14 justify-start">
                        <CalendarIcon className="w-5 h-5 mr-3 text-pink-400" /> Agendar Postagem
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#0c0c16] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
                <DialogHeader className="p-6 pb-2 bg-white/[0.02]">
                    <DialogTitle className="text-xl">Agendar Postagem</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/50 uppercase">Plataforma</label>
                        <select
                            className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-pink-500 focus:outline-none"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                        >
                            <option value="instagram">Instagram Stories</option>
                            <option value="tiktok">TikTok</option>
                            <option value="reels">Instagram Reels</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter / X</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-white/50 uppercase">Data</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="date"
                                    className="w-full bg-[#080810] border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white focus:border-pink-500 focus:outline-none"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-white/50 uppercase">Horário</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="time"
                                    className="w-full bg-[#080810] border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white focus:border-pink-500 focus:outline-none"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSchedule}
                        disabled={loading}
                        className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white font-bold mt-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                        Confirmar Agendamento
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
