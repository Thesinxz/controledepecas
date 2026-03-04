import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function MetricCard({
    title,
    value,
    icon,
    trend,
    trendUp
}: {
    title: string,
    value: string,
    icon: React.ReactNode,
    trend?: string,
    trendUp?: boolean
}) {
    return (
        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">{title}</span>
                <div className="p-2 bg-white/5 rounded-xl">
                    {icon}
                </div>
            </div>

            <div className="flex flex-col mt-2">
                <span className="text-3xl font-black">{value}</span>
                {trend && (
                    <span className={`text-xs mt-2 flex items-center font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                        {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trend}
                    </span>
                )}
            </div>
        </div>
    )
}
