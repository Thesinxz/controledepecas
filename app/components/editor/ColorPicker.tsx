'use client'

const PRESET_COLORS = [
    '#ffffff', '#000000', '#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'
]

const PRESET_GRADIENTS = [
    'linear-gradient(to bottom right, #ec4899, #a855f7)',
    'linear-gradient(to bottom right, #3b82f6, #10b981)',
    'linear-gradient(to bottom right, #f59e0b, #ef4444)',
    'linear-gradient(to bottom, #000000, #434343)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
]

interface Props {
    label: string
    value: string
    onChange: (val: string, type?: 'solid' | 'gradient') => void
    showGradients?: boolean
}

export function ColorPicker({ label, value, onChange, showGradients }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>

            <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                    <button
                        key={color}
                        onClick={() => onChange(color, 'solid')}
                        className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${value === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            {showGradients && (
                <>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">Gradientes</span>
                    <div className="grid grid-cols-3 gap-2">
                        {PRESET_GRADIENTS.map(grad => (
                            <button
                                key={grad}
                                onClick={() => onChange(grad, 'gradient')}
                                className={`h-10 rounded-xl border-2 transition-transform active:scale-95 ${value === grad ? 'border-white scale-105' : 'border-transparent'}`}
                                style={{ background: grad }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
