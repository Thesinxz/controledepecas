import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
    {
        name: 'Free',
        price: 'R$ 0',
        period: '/mês',
        desc: 'Para testar e criar seus primeiros stories.',
        features: [
            '10 scripts por mês',
            'Modelo Gemini Flash-Lite',
            'Templates básicos',
            'Histórico de 7 dias'
        ],
        cta: 'Começar Grátis',
        href: '/login',
        popular: false,
    },
    {
        name: 'Pro',
        price: 'R$ 29',
        period: '/mês',
        desc: 'Para criadores de conteúdo frequentes.',
        features: [
            '100 scripts por mês',
            'Modelo Claude Haiku (Melhor texto)',
            'Todos os templates premium',
            'Histórico ilimitado',
            'Exportação para PDF'
        ],
        cta: 'Assinar Pro',
        href: '/login?plan=pro', // Em produção redireciona para Stripe Checkout
        popular: true,
    },
    {
        name: 'Business',
        price: 'R$ 79',
        period: '/mês',
        desc: 'Para agências e social medias.',
        features: [
            'Scripts ilimitados',
            'Geração em massa prioritária',
            'Claude Haiku + Cache de longo prazo',
            'Suporte prioritário via WhatsApp'
        ],
        cta: 'Assinar Business',
        href: '/login?plan=business',
        popular: false,
    }
]

export default function PricingPage() {
    return (
        <div className="flex flex-col w-full gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Investimento</h1>
                <p className="text-white/60 text-sm">Escolha o plano ideal para a sua produção de conteúdo.</p>
            </div>

            <div className="flex flex-col gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative p-6 rounded-3xl border flex flex-col gap-6 ${plan.popular
                                ? 'bg-gradient-to-b from-purple-500/10 to-pink-500/5 border-purple-500/30'
                                : 'bg-white/5 border-white/5'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] uppercase tracking-wider font-bold py-1 px-3 rounded-full">
                                Mais Popular
                            </div>
                        )}

                        <div>
                            <h2 className="font-semibold text-lg text-white/90">{plan.name}</h2>
                            <div className="flex items-end gap-1 mt-2">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-white/50 mb-1">{plan.period}</span>
                            </div>
                            <p className="text-sm text-white/50 mt-2">{plan.desc}</p>
                        </div>

                        <ul className="flex flex-col gap-3">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href={plan.href} className="mt-auto pt-4">
                            <Button
                                variant={plan.popular ? 'default' : 'secondary'}
                                className={`w-full h-12 rounded-xl font-medium ${plan.popular ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {plan.cta}
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
