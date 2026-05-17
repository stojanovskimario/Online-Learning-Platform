import { useState, type ReactNode } from 'react'
import AppSidebar from '@/components/AppSidebar'

interface AppLayoutProps {
    header: ReactNode
    children: ReactNode
}

const AppLayout = ({ header, children }: AppLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-[#0f1117] text-white lg:h-screen lg:overflow-hidden">
            <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
                <div className="flex items-center gap-3 border-b border-white/5 bg-[#13151f] px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                        aria-label="Open navigation"
                    >
                        ☰
                    </button>
                    <span className="text-sm font-semibold">
                        <span className="text-blue-400">Learn</span>ix
                    </span>
                </div>

                {header}
                <main className="flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:overflow-y-auto lg:px-8 lg:py-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AppLayout
