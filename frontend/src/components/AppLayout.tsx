import type { ReactNode } from 'react'
import AppSidebar from '@/components/AppSidebar'

interface AppLayoutProps {
    header: ReactNode
    children: ReactNode
}

const AppLayout = ({ header, children }: AppLayoutProps) => {
    return (
        <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
            <AppSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {header}
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AppLayout
