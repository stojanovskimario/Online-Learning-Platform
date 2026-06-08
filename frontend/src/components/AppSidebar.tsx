import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
    { label: 'Dashboard', icon: '\u229e', path: '/dashboard' },
    { label: 'My Courses', icon: '\u25ce', path: '/courses/my' },
    { label: 'Explore', icon: '\u25c8', path: '/courses' },
    { label: 'Progress', icon: '\u25d0', path: '/progress' },
    { label: 'Billing', icon: '\u24b8', path: '/billing' },
    { label: 'Quizzes', icon: '\u25c7', path: '/quizzes' },
    { label: 'Certificates', icon: '\u25c9', path: '/certificates' },
]

interface AppSidebarProps {
    isOpen: boolean
    onClose: () => void
}

const AppSidebar = ({ isOpen, onClose }: AppSidebarProps) => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    const isNavItemActive = (path: string) => {
        if (path === '/courses') {
            return location.pathname === '/courses' || /^\/courses\/\d+(\/lessons\/\d+)?$/.test(location.pathname)
        }

        if (path === '/quizzes') {
            return (
                location.pathname === '/quizzes' ||
                /^\/courses\/\d+\/(quiz|lessons\/\d+\/quiz)(\/result)?$/.test(location.pathname)
            )
        }

        return location.pathname === path
    }

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    aria-label="Close navigation"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#13151f] transition-transform duration-200 lg:static lg:z-auto lg:w-56 lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
            <div className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-blue-400">Learn</span>ix
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/40 hover:text-white lg:hidden"
                        aria-label="Close navigation"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30 px-3 mb-2">Main</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={onClose}
                        className={() =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                                isNavItemActive(item.path)
                                    ? 'bg-blue-500/10 text-blue-400 font-medium'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 py-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full mt-2 text-xs text-white/30 hover:text-white/60 transition-colors text-left px-3 py-1"
                >
                    Sign out {'\u2192'}
                </button>
            </div>
            </aside>
        </>
    )
}

export default AppSidebar
