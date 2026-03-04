'use client'

import { useState } from 'react'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, Instagram, Send, Video, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CalendarView({ initialPosts }: { initialPosts: any[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const onDateClick = (day: Date) => setSelectedDate(day)

    const postsForSelected = initialPosts.filter(p => isSameDay(new Date(p.scheduled_for), selectedDate))

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-white/5 bg-transparent border-0 text-white rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
                <div className="text-sm font-bold capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </div>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-white/5 bg-transparent border-0 text-white rounded-full"><ChevronRight className="w-5 h-5" /></Button>
            </div>
        )
    }

    const renderDays = () => {
        const days = []
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 })
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center font-bold text-[10px] text-white/40 uppercase tracking-widest py-2" key={i}>
                    {format(addDays(startDate, i), 'EEEEEE', { locale: ptBR })}
                </div>
            )
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ''

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd')
                const cloneDay = day

                const dayPosts = initialPosts.filter(p => isSameDay(new Date(p.scheduled_for), cloneDay))

                days.push(
                    <div
                        className={`flex flex-col items-center justify-start p-1 h-14 border border-transparent rounded-xl cursor-pointer transition-colors
                            ${!isSameMonth(day, monthStart) ? 'text-white/20' : isSameDay(day, selectedDate) ? 'bg-pink-500/20 border-pink-500 text-pink-500 font-bold' : 'text-white hover:bg-white/5'}`}
                        key={day.toString()}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className="text-xs mt-1">{formattedDate}</span>
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                            {dayPosts.map((p, idx) => (
                                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            ))}
                        </div>
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(<div className="grid grid-cols-7 gap-1" key={day.toString()}>{days}</div>)
            days = []
        }
        return <div className="mb-6">{rows}</div>
    }

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />
            case 'tiktok': return <Video className="w-4 h-4 text-white" />
            case 'linkedin': return <Linkedin className="w-4 h-4 text-blue-500" />
            case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />
            default: return <Send className="w-4 h-4 text-white" />
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-4">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold px-2 text-white/50 border-b border-white/5 pb-2">
                    {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </h3>

                {postsForSelected.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {postsForSelected.map((post) => (
                            <Link key={post.id} href={`/scripts/${post.script_id}`} className="block">
                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                                            {getPlatformIcon(post.platform)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight line-clamp-1">{post.scripts?.title || 'Roteiro sem título'}</span>
                                            <span className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" /> {format(new Date(post.scheduled_for), "HH:mm")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                        <p className="text-sm text-white/40">Nenhum post agendado para este dia.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
