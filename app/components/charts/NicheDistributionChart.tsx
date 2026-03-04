'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const COLORS = ['#ec4899', '#a855f7', '#6366f1', '#3b82f6', '#14b8a6', '#f59e0b']

export function NicheDistributionChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="bg-white/5 border-white/5 flex items-center justify-center p-8">
                <p className="text-white/40 text-sm">Nenhum dado de nicho disponível.</p>
            </Card>
        )
    }

    return (
        <Card className="bg-white/5 border-white/5">
            <CardHeader>
                <CardTitle className="text-lg text-white">Top Nichos</CardTitle>
                <CardDescription className="text-white/50">Distribuição por setor</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-[#0c0c16] border border-white/10 p-2 rounded-lg text-sm shadow-xl">
                                                <p className="font-bold text-white flex items-center gap-2">
                                                    <span className="w-2 h-2 inline-block rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                                                    {payload[0].payload.name}
                                                </p>
                                                <p className="text-white/70 mt-1 pl-4">{payload[0].value} roteiros</p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-white/70 text-xs ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
