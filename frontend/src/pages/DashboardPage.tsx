import { useAuth } from '@/hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const navItems = [
    { label: 'Dashboard', icon: '⊞', path: '/dashboard', active: true },
    { label: 'My Courses', icon: '◎', path: '/courses/my' },
    { label: 'Explore', icon: '◈', path: '/courses' },
    { label: 'Progress', icon: '◐', path: '/progress' },
    { label: 'Quizzes', icon: '◇', path: '/quizzes' },
    { label: 'Certificates', icon: '◉', path: '/certificates' },
]

const DashboardPage = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'

    return (
        <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
            <aside className="w-56 flex-shrink-0 bg-[#13151f] border-r border-white/5 flex flex-col">
                <div className="px-6 py-5 border-b border-white/5">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-blue-400">Learn</span>ix
          </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 px-3 mb-2">Main</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                                item.active
                                    ? 'bg-blue-500/10 text-blue-400 font-medium'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
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
                        Sign out →
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-[#13151f] border-b border-white/5 px-8 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                        <p className="text-xs text-white/40">Welcome back, {user?.firstName}</p>
                    </div>
                    <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                user?.subscriptionTier === 'FREE'
                    ? 'bg-white/5 text-white/40'
                    : 'bg-blue-500/20 text-blue-400'
            }`}>
              {user?.subscriptionTier === 'FREE' ? 'Free Plan' : 'Premium'}
            </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Enrolled Courses', value: '0', sub: 'courses active' },
                            { label: 'Completed', value: '0', sub: 'courses done' },
                            { label: 'Quizzes Passed', value: '0', sub: 'avg score —' },
                            { label: 'Certificates', value: '0', sub: 'earned' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-[#13151f] border border-white/5 rounded-xl p-5">
                                <p className="text-xs text-white/40 mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-xs text-white/30">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 bg-[#13151f] border border-white/5 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-semibold text-white">Active Courses</h2>
                                <Link to="/courses" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                    Explore →
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl mb-4">
                                    ◎
                                </div>
                                <p className="text-sm font-medium text-white/60 mb-1">No courses yet</p>
                                <p className="text-xs text-white/30 mb-4">Browse the catalogue and enrol in your first course</p>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/courses')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                                >
                                    Browse Courses
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-[#13151f] border border-white/5 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-white">Certificates</h2>
                                    <Link to="/certificates" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
                                </div>
                                <div className="text-center py-6">
                                    <p className="text-3xl mb-2">◉</p>
                                    <p className="text-xs text-white/30">No certificates yet</p>
                                </div>
                            </div>

                            <div className="bg-[#13151f] border border-white/5 rounded-xl p-6">
                                <h2 className="text-sm font-semibold text-white mb-4">Recent Quizzes</h2>
                                <div className="text-center py-6">
                                    <p className="text-3xl mb-2">◇</p>
                                    <p className="text-xs text-white/30">No quizzes taken yet</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {user?.subscriptionTier === 'FREE' && (
                        <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-400 font-medium mb-1">✦ PREMIUM PLAN</p>
                                <p className="text-sm font-semibold text-white">Unlock all courses & advanced features</p>
                                <p className="text-xs text-white/40 mt-1">Unlimited quiz retakes, AI assistant, certificates — $9/mo</p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex-shrink-0 ml-6"
                                onClick={() => navigate('/billing')}
                            >
                                Upgrade to Premium →
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default DashboardPage