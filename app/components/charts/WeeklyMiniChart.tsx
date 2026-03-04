'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataPoint {
    date: string
    count: number
}

export function WeeklyMiniChart({ data }: { data: DataPoint[] }) {
    return (
        <Card className="bg-white/5 border-white/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Roteiros (Últimos 7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[80px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="date" hide />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-[#0c0c16] border border-white/10 p-2 rounded-lg text-xs">
                                                <p className="text-white/70 mb-1">{payload[0].payload.date}</p>
                                                <p className="font-bold text-pink-400">{payload[0].value} roteiros</p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#ec4899"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
