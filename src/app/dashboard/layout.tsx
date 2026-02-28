import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/actions'
import { LogOut, User as UserIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role || 'customer'

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] relative flex flex-col">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'worker' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            <UserIcon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold tracking-tight text-white">
                            KamgarConnect <span className="text-gray-500 font-normal">| {role === 'worker' ? 'Worker' : 'Customer'}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
                        <form action={signout}>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-colors border border-white/5 shadow-sm">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
