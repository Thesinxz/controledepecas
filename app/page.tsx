import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Wand2, Zap, LayoutTemplate, MessageSquareText } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full gap-16 pb-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-12 gap-6 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-[80px] -z-10 rounded-full" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-pink-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Inteligência Artificial dos Stories</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
          Roteiros que <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">vendem mais</span>
        </h1>
        <p className="text-white/60 text-lg max-w-sm">
          Crie sequências de Stories profissionais, com gatilhos mentais e alta conversão em apenas 5 segundos.
        </p>
        <div className="flex flex-col w-full gap-3 mt-4">
          <Link href="/login" className="w-full">
            <Button className="w-full h-14 text-base font-semibold bg-white text-black hover:bg-white/90 rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Começar Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-xs text-white/40">Não requer cartão de crédito • 10 roteiros grátis</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">Como funciona</h2>
        <div className="grid gap-4">
          {[
            {
              icon: LayoutTemplate,
              title: '1. O seu Briefing',
              desc: 'Diga o seu nicho, seu produto e o que você quer vender hoje.',
              color: 'text-blue-400'
            },
            {
              icon: Wand2,
              title: '2. Pipeline de IA',
              desc: '4 Agentes de IA trabalham juntos para criar ganchos, histórias e a call-to-action perfeita.',
              color: 'text-purple-400'
            },
            {
              icon: MessageSquareText,
              title: '3. Copie e Grave',
              desc: 'Receba o texto de tela, o que falar e até ideias de recursos visuais.',
              color: 'text-pink-400'
            },
          ].map((feat, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className={`mt-1 ${feat.color}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{feat.title}</h3>
                <p className="text-sm text-white/50">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center text-center gap-6 bg-gradient-to-b from-purple-900/20 to-transparent p-8 rounded-3xl border border-white/5">
        <Zap className="w-10 h-10 text-yellow-400" />
        <h2 className="text-2xl font-bold">Pronto para triplicar suas visualizações?</h2>
        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full h-12 text-base font-medium rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white">
            Criar minha conta
          </Button>
        </Link>
      </section>

      <footer className="text-center text-xs text-white/30 pt-8 border-t border-white/10">
        &copy; {new Date().getFullYear()} StoryAI. Todos os direitos reservados.
      </footer>
    </div>
  )
}
