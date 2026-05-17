import { useAuth } from '@/hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import AppLayout from '@/components/AppLayout'

const DashboardPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate()



    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
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
            }
        >
                    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4 xl:mb-8">
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

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                        <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 sm:p-6 lg:col-span-2">
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

                        <div className="flex flex-col gap-4 lg:gap-6">
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
                        <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs text-blue-400 font-medium mb-1">✦ PREMIUM PLAN</p>
                                <p className="text-sm font-semibold text-white">Unlock all courses & advanced features</p>
                                <p className="text-xs text-white/40 mt-1">Unlimited quiz retakes, AI assistant, certificates — $9/mo</p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex-shrink-0 sm:ml-6"
                                onClick={() => navigate('/billing')}
                            >
                                Upgrade to Premium →
                            </Button>
                        </div>
                    )}
        </AppLayout>
    )
}

export default DashboardPage
