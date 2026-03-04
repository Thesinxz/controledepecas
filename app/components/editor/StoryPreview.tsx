'use client'

import { StoryElement } from '@/app/types/ai'

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
    story: StoryElement
    visuals: Visuals
}

export function StoryPreview({ story, visuals }: Props) {
    const getBgStyle = () => {
        if (visuals.background_type === 'gradient') {
            return { background: visuals.background_gradient }
        }
        return { backgroundColor: visuals.background_color }
    }

    const getPositionClass = () => {
        switch (visuals.text_position) {
            case 'top': return 'justify-start pt-20'
            case 'bottom': return 'justify-end pb-20'
            default: return 'justify-center'
        }
    }

    return (
        <div
            className="relative w-full aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white/10 flex flex-col p-8 text-center transition-all duration-500"
            style={getBgStyle()}
        >
            <div className={`flex flex-col h-full w-full ${getPositionClass()}`}>
                <h2
                    className="font-black leading-tight drop-shadow-lg animate-in fade-in zoom-in duration-500"
                    style={{
                        color: visuals.text_color,
                        fontSize: `${visuals.font_size}px`,
                        fontFamily: visuals.font_family === 'System' ? 'inherit' : visuals.font_family
                    }}
                >
                    {story.main_text}
                </h2>
            </div>

            {/* Decoration elements to make it look "premium" */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute top-12 left-6 right-6 flex justify-between">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex gap-2">
                    <div className="w-2 h-10 rounded-full bg-white/10" />
                </div>
            </div>
        </div>
    )
}
