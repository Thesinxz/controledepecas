'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#080810]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-center">
            <div className="w-full max-w-md px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-pink-500 to-purple-600 p-1.5 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        StoryAI
                    </span>
                </Link>
            </div>
        </header>
    )
}
