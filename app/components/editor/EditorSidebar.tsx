'use client'

import { ColorPicker } from './ColorPicker'
import { FontPicker } from './FontPicker'
import { Slider } from '@/components/ui/slider'
import { AlignCenter, AlignStartVertical as AlignTop, AlignEndVertical as AlignBottom } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Visuals {
    background_type: string
    background_color: string
    background_gradient?: string
    text_color: string
    font_size: number
    font_family: string
    text_position: string
}

interface Props {
    visuals: Visuals
    setVisuals: (v: Visuals) => void
}

export function EditorSidebar({ visuals, setVisuals }: Props) {
    const update = (key: keyof Visuals, val: any) => {
        setVisuals({ ...visuals, [key]: val })
    }

    return (
        <div className="flex flex-col gap-8 pb-32">
            <ColorPicker
                label="Fundo"
                value={visuals.background_type === 'gradient' ? visuals.background_gradient! : visuals.background_color}
                onChange={(val, type) => {
                    if (type === 'gradient') {
                        setVisuals({ ...visuals, background_type: 'gradient', background_gradient: val })
                    } else {
                        setVisuals({ ...visuals, background_type: 'solid', background_color: val })
                    }
                }}
                showGradients={true}
            />

            <ColorPicker
                label="Cor do Texto"
                value={visuals.text_color}
                onChange={(val) => update('text_color', val)}
            />

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tamanho Texto</span>
                    <span className="text-xs font-bold">{visuals.font_size}px</span>
                </div>
                <Slider
                    value={[visuals.font_size]}
                    min={16}
                    max={80}
                    step={1}
                    onValueChange={([val]) => update('font_size', val)}
                    className="py-4"
                />
            </div>

            <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Alinhamento</span>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => update('text_position', 'top')}
                        className={`h-12 border ${visuals.text_position === 'top' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                        <AlignTop className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => update('text_position', 'center')}
                        className={`h-12 border ${visuals.text_position === 'center' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                        <AlignCenter className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => update('text_position', 'bottom')}
                        className={`h-12 border ${visuals.text_position === 'bottom' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                        <AlignBottom className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <FontPicker
                value={visuals.font_family}
                onChange={(val) => update('font_family', val)}
            />
        </div>
    )
}
