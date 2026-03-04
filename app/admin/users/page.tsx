import { createClient } from '@/app/lib/supabase/server'
import { MoreHorizontal, Search, Settings2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminUsersList() {
    const supabase = await createClient()

    // Fetch users (paginated in real app, all for MVP admin)
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Usuários</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" /> Exportar
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar por e-mail ou CPF..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-pink-500 focus:outline-none transition-colors"
                    />
                </div>
                <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-white shrink-0 hover:bg-white/10">
                    <Settings2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-white/50 uppercase bg-white/5 border-b border-white/5 font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Plano</th>
                            <th className="px-6 py-4">Uso (Mês)</th>
                            <th className="px-6 py-4">Criado em</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="truncate max-w-[150px]">{user.full_name || 'Sem Nome'}</span>
                                        <span className="text-xs text-white/40 truncate max-w-[150px]">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.plan === 'pro' ? 'bg-pink-500/20 text-pink-400' :
                                            user.plan === 'business' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-white/10 text-white/60'
                                        }`}>
                                        {user.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold">{user.scripts_used_this_month} / {user.scripts_limit < 0 ? 'ထ' : user.scripts_limit}</span>
                                        {user.scripts_limit > 0 && (
                                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-pink-500"
                                                    style={{ width: `${Math.min((user.scripts_used_this_month / user.scripts_limit) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white/60 text-xs">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10 rounded-full w-8 h-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!users || users.length === 0) && (
                    <div className="p-8 text-center text-white/40">
                        Nenhum usuário encontrado.
                    </div>
                )}
            </div>
        </div>
    )
}
