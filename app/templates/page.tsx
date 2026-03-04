'use client'

import { useState } from 'react'
import { Sparkles, Play, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const templates = [
    { id: 1, name: 'Lançamento Sensorial', niche: 'Beleza e Estética', stories: 7, isPremium: false },
    { id: 2, name: 'Venda Rápida (Flash)', niche: 'Varejo', stories: 5, isPremium: false },
    { id: 3, name: 'Objeção Quebrada', niche: 'Infoprodutos', stories: 9, isPremium: true },
    { id: 4, name: 'Autoridade Instantânea', niche: 'Serviços B2B', stories: 6, isPremium: true },
    { id: 5, name: 'Bastidores + Oferta', niche: 'Moda', stories: 8, isPremium: false },
    { id: 6, name: 'Antecipação de Curso', niche: 'Educação', stories: 10, isPremium: true },
]

const niches = ['Todos', 'Beleza e Estética', 'Varejo', 'Infoprodutos', 'Serviços B2B', 'Moda', 'Educação']

export default function TemplatesPage() {
    const [filter, setFilter] = useState('Todos')
    const [search, setSearch] = useState('')

    const filtered = templates.filter(t =>
        (filter === 'Todos' || t.niche === filter) &&
        t.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col w-full gap-6 py-4 pb-24">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    Modelos
                </h1>
                <p className="text-sm text-white/50">Comece mais rápido com roteiros pré-testados.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                <Input
                    className="w-full pl-9 bg-white/5 border-white/10 rounded-2xl h-12"
                    placeholder="Buscar modelo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none -mx-4 px-4 mask-edges">
                {niches.map(n => (
                    <button
                        key={n}
                        onClick={() => setFilter(n)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border ${filter === n ? 'bg-white text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {n}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 mt-2">
                {filtered.map(t => (
                    <div key={t.id} className="relative p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4 group hover:bg-white/10 transition-colors">
                        {t.isPremium && (
                            <div className="absolute top-4 right-4 text-[10px] font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-2 py-0.5 rounded-sm">
                                PRO
                            </div>
                        )}
                        <div>
                            <span className="text-xs text-pink-400 font-medium">{t.niche}</span>
                            <h2 className="font-bold text-lg text-white/90 leading-tight mt-1">{t.name}</h2>
                            <p className="text-xs text-white/40 mt-1">{t.stories} stories na sequência</p>
                        </div>

                        <Link href={`/create?template=${t.id}`} className="mt-2">
                            <Button className="w-full h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl">
                                <Play className="w-4 h-4 mr-2" />
                                Usar Modelo
                            </Button>
                        </Link>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-white/40 text-sm">Nenhum modelo encontrado.</div>
                )}
            </div>
        </div>
    )
}
