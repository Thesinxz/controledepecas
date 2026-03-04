'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function ScriptsPerDayChart({ data }: { data: any[] }) {
    return (
        <Card className="bg-white/5 border-white/5 col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg text-white">Roteiros Gerados</CardTitle>
                <CardDescription className="text-white/50">Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} minTickGap={30} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} allowDecimals={false} />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-[#0c0c16] border border-white/10 p-3 rounded-xl shadow-xl">
                                                <p className="font-bold text-white mb-2">{payload[0].payload.date}</p>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <span className="text-pink-400 font-medium">
                                                        <span className="w-2 h-2 rounded-full bg-pink-500 inline-block mr-2" />
                                                        {payload[0].value} roteiros
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="scripts"
                                stroke="#ec4899"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#0c0c16", strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#ec4899" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
