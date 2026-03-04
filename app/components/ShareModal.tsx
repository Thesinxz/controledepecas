'use client'

import { useState } from 'react'
import { Copy, Instagram, Link as LinkIcon, Download, Loader2, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import { StoryElement } from '@/app/types/ai'

interface Props {
    scriptId: string
    stories: StoryElement[]
    trigger?: React.ReactNode
}

export function ShareModal({ scriptId, stories, trigger }: Props) {
    const [open, setOpen] = useState(false)
    const [exporting, setExporting] = useState(false)

    const copyText = () => {
        const text = stories.map(s => `(${s.position}) ${s.main_text}\nFALA: ${s.narration}`).join('\n\n')
        navigator.clipboard.writeText(text)
        toast.success('Roteiro copiado para a área de transferência!')
    }

    const copyLink = () => {
        const url = `${window.location.origin}/share/${scriptId}`
        navigator.clipboard.writeText(url)
        toast.success('Link público copiado!')
    }

    const shareToInstagram = () => {
        // Copy text first so user can paste it into Instagram
        copyText()
        toast('Texto copiado! Abrindo Instagram...', { icon: '📸' })

        setTimeout(() => {
            // Attempt to open Instagram Stories camera deep link
            window.location.href = 'instagram://story-camera'

            // Fallback for desktop/non-installed
            setTimeout(() => {
                window.open('https://instagram.com', '_blank')
            }, 500)
        }, 1500)
    }

    const exportImage = async () => {
        try {
            setExporting(true)
            toast.info('Gerando imagem...')

            // Create a temporary hidden container to render the whole script
            const container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.left = '-9999px'
            container.style.top = '0'
            container.style.width = '1080px' // High resolution for IG
            container.style.background = '#080810'
            container.style.padding = '40px'
            container.style.color = '#fff'
            container.style.fontFamily = 'system-ui, sans-serif'

            let html = `<h1 style="font-size: 48px; color: #ec4899; margin-bottom: 40px; text-align: center;">Meu Roteiro StoryAI</h1>`

            stories.forEach(s => {
                html += `
                <div style="background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px; margin-bottom: 24px;">
                    <span style="background: #ec4899; color: white; padding: 4px 12px; border-radius: 100px; font-weight: bold; font-size: 20px;">Story ${s.position}</span>
                    <h2 style="font-size: 40px; margin: 20px 0;">${s.main_text}</h2>
                    <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; border-left: 8px solid #a855f7;">
                        <p style="color: #a855f7; font-weight: bold; font-size: 16px; letter-spacing: 2px; text-transform: uppercase;">Fala / Narração</p>
                        <p style="font-size: 24px; margin-top: 12px; color: rgba(255,255,255,0.8);">${s.narration}</p>
                    </div>
                </div>`
            })

            container.innerHTML = html
            document.body.appendChild(container)

            const canvas = await html2canvas(container, {
                scale: 2,
                backgroundColor: '#080810',
                logging: false,
            })

            document.body.removeChild(container)

            const dataUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `storyai-script-${scriptId.slice(0, 8)}.png`
            link.href = dataUrl
            link.click()

            toast.success('Imagem exportada com sucesso!')
        } catch (e) {
            console.error(e)
            toast.error('Erro ao gerar imagem')
        } finally {
            setExporting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
                        <Share className="w-4 h-4 mr-2" /> Compartilhar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#0c0c16] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
                <DialogHeader className="p-6 pb-2 bg-white/[0.02]">
                    <DialogTitle className="text-xl">Opções de Exportação</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2 p-6">
                    <Button
                        variant="ghost"
                        onClick={shareToInstagram}
                        className="w-full justify-start h-14 bg-gradient-to-r from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 hover:from-[#833ab4]/20 hover:via-[#fd1d1d]/20 hover:to-[#fcb045]/20 border border-white/5"
                    >
                        <Instagram className="w-5 h-5 mr-3 text-pink-500" />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-white">Postar no Instagram</span>
                            <span className="text-[10px] text-white/50">Copia o texto e abre o app nativo</span>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={copyText}
                        className="w-full justify-start h-14 bg-white/5 hover:bg-white/10 border border-white/5 text-white"
                    >
                        <Copy className="w-5 h-5 mr-3 text-white/50" />
                        Copiar apenas o Texto
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={copyLink}
                        className="w-full justify-start h-14 bg-white/5 hover:bg-white/10 border border-white/5 text-white"
                    >
                        <LinkIcon className="w-5 h-5 mr-3 text-white/50" />
                        <div className="flex flex-col items-start">
                            <span className="text-sm">Link de Visualização Pública</span>
                            <span className="text-[10px] text-white/50">Ideal para enviar para equipe/clientes</span>
                        </div>
                    </Button>

                    <div className="my-2 border-t border-white/10" />

                    <Button
                        variant="ghost"
                        onClick={exportImage}
                        disabled={exporting}
                        className="w-full justify-start h-14 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                    >
                        {exporting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Download className="w-5 h-5 mr-3" />}
                        Exportar roteiro como Imagem
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
