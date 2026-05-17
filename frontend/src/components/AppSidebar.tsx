import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
    { label: 'Dashboard', icon: '\u229e', path: '/dashboard' },
    { label: 'My Courses', icon: '\u25ce', path: '/courses/my' },
    { label: 'Explore', icon: '\u25c8', path: '/courses' },
    { label: 'Progress', icon: '\u25d0', path: '/progress' },
    { label: 'Quizzes', icon: '\u25c7', path: '/quizzes' },
    { label: 'Certificates', icon: '\u25c9', path: '/certificates' },
]

const AppSidebar = () => {
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
            return location.pathname === '/courses' || /^\/courses\/\d+$/.test(location.pathname)
        }

        return location.pathname === path
    }

    return (
        <aside className="w-56 flex-shrink-0 bg-[#13151f] border-r border-white/5 flex flex-col">
            <div className="px-6 py-5 border-b border-white/5">
                <span className="text-xl font-bold tracking-tight">
                    <span className="text-blue-400">Learn</span>ix
                </span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30 px-3 mb-2">Main</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
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
    )
}

export default AppSidebar
