import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { getCoursesApi } from '@/api/courses.api'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
    { label: 'Dashboard', icon: '⊞', path: '/dashboard' },
    { label: 'My Courses', icon: '◎', path: '/courses/my' },
    { label: 'Explore', icon: '◈', path: '/courses', active: true },
    { label: 'Progress', icon: '◐', path: '/progress' },
    { label: 'Quizzes', icon: '◇', path: '/quizzes' },
    { label: 'Certificates', icon: '◉', path: '/certificates' },
]

const CoursesPage = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCoursesApi(),
    })

    const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

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
                        <h1 className="text-lg font-semibold text-white">Explore Courses</h1>
                        <p className="text-xs text-white/40">Browse and enrol in courses</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {isLoading && (
                        <div className="grid grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-[#13151f] border border-white/5 rounded-xl p-5 animate-pulse">
                                    <div className="h-32 bg-white/5 rounded-lg mb-4" />
                                    <div className="h-4 bg-white/5 rounded mb-2" />
                                    <div className="h-3 bg-white/5 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                            <p className="text-red-400 text-sm">Failed to load courses. Please try again.</p>
                        </div>
                    )}

                    {data && data.content.length === 0 && (
                        <div className="bg-[#13151f] border border-white/5 rounded-xl p-12 text-center">
                            <p className="text-2xl mb-3">◈</p>
                            <p className="text-sm font-medium text-white/60 mb-1">No courses available yet</p>
                            <p className="text-xs text-white/30">Check back soon</p>
                        </div>
                    )}

                    {data && data.content.length > 0 && (
                        <>
                            <p className="text-xs text-white/30 mb-4">{data.totalElements} courses available</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.content.map((course) => (
                                    <div
                                        key={course.id}
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                        className="bg-[#13151f] border border-white/5 rounded-xl p-5 cursor-pointer hover:border-blue-500/30 hover:bg-white/[0.02] transition-all group"
                                    >
                                        <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center text-3xl">
                                            {course.thumbnailUrl
                                                ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                                                : '◈'
                                            }
                                        </div>

                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                                                {course.title}
                                            </h3>
                                            {course.isPremium && (
                                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                          PRO
                        </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-white/40 mb-4 line-clamp-2">{course.description}</p>

                                        <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">
                        {course.category?.name ?? 'General'}
                      </span>
                                            <span className="text-sm font-semibold text-white">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}

export default CoursesPage