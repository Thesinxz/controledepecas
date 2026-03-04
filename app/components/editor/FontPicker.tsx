'use client'

const FONTS = [
    { name: 'Padrão', value: 'System' },
    { name: 'Moderno', value: 'Inter, sans-serif' },
    { name: 'Impacto', value: 'Impact, Charcoal, sans-serif' },
    { name: 'Elegante', value: 'Georgia, serif' },
    { name: 'Monospaçado', value: 'Courier New, monospace' }
]

interface Props {
    value: string
    onChange: (val: string) => void
}

export function FontPicker({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Fonte</span>
            <div className="flex flex-col gap-2">
                {FONTS.map(font => (
                    <button
                        key={font.value}
                        onClick={() => onChange(font.value)}
                        className={`w-full p-3 rounded-xl border text-sm text-left transition-colors ${value === font.value ? 'bg-white/10 border-white/20 font-bold' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                        style={{ fontFamily: font.value === 'System' ? 'inherit' : font.value }}
                    >
                        {font.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
