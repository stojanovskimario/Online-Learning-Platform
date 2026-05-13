import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourseByIdApi, enrollInCourseApi } from '@/api/courses.api'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
    { label: 'Dashboard', icon: '⊞', path: '/dashboard' },
    { label: 'My Courses', icon: '◎', path: '/courses/my' },
    { label: 'Explore', icon: '◈', path: '/courses', active: true },
    { label: 'Progress', icon: '◐', path: '/progress' },
    { label: 'Quizzes', icon: '◇', path: '/quizzes' },
    { label: 'Certificates', icon: '◉', path: '/certificates' },
]

const CourseDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['course', id],
        queryFn: () => getCourseByIdApi(Number(id)),
        enabled: !!id,
    })

    const enrollMutation = useMutation({
        mutationFn: () => enrollInCourseApi(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate('/dashboard')
        },
    })

    const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    const totalLessons = course?.sections?.reduce(
        (acc, section) => acc + (section.lessons?.length ?? 0), 0
    ) ?? 0

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
                <header className="bg-[#13151f] border-b border-white/5 px-8 py-4 flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate('/courses')}
                        className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                        ← Courses
                    </button>
                    <span className="text-white/10">/</span>
                    <span className="text-sm text-white/50 truncate">{course?.title}</span>
                </header>

                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {isLoading && (
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-white/5 rounded w-1/2" />
                            <div className="h-4 bg-white/5 rounded w-1/3" />
                            <div className="h-32 bg-white/5 rounded-xl" />
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                            <p className="text-red-400 text-sm">Failed to load course.</p>
                        </div>
                    )}

                    {course && (
                        <div className="max-w-3xl">
                            <div className="flex items-start justify-between gap-6 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-white/5 text-white/40 px-2 py-1 rounded">
                      {course.category?.name ?? 'General'}
                    </span>
                                        {course.isPremium && (
                                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-medium">
                        PRO
                      </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
                                    <p className="text-white/50 text-sm leading-relaxed">{course.description}</p>
                                </div>

                                <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 flex-shrink-0 w-52 text-center">
                                    <p className="text-2xl font-bold text-white mb-1">
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </p>
                                    <p className="text-xs text-white/30 mb-4">
                                        {totalLessons} lessons · {course.sections?.length ?? 0} sections
                                    </p>
                                    {course.isPremium && user?.subscriptionTier === 'FREE' ? (
                                        <div>
                                            <div className="bg-white/5 rounded-lg px-4 py-2.5 mb-3">
                                                <p className="text-xs text-white/40">🔒 Premium course</p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/billing')}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                                            >
                                                Upgrade to Enrol
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => enrollMutation.mutate()}
                                            disabled={enrollMutation.isPending}
                                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                                        >
                                            {enrollMutation.isPending ? 'Enrolling...' : 'Enrol Now'}
                                        </button>
                                    )}
                                    {enrollMutation.isError && (
                                        <p className="text-red-400 text-xs mt-2">Already enrolled or error occurred.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#13151f] border border-white/5 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5">
                                    <h2 className="text-sm font-semibold text-white">Course Syllabus</h2>
                                </div>

                                {course.sections?.length === 0 && (
                                    <div className="px-6 py-8 text-center">
                                        <p className="text-white/30 text-sm">No sections yet</p>
                                    </div>
                                )}

                                {course.sections?.map((section, sIndex) => (
                                    <div key={section.id} className="border-b border-white/5 last:border-0">
                                        <div className="px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                        <span className="text-xs text-white/20 font-mono">
                          {String(sIndex + 1).padStart(2, '0')}
                        </span>
                                                <h3 className="text-sm font-medium text-white">{section.title}</h3>
                                            </div>
                                            <span className="text-xs text-white/30">
                        {section.lessons?.length ?? 0} lessons
                      </span>
                                        </div>

                                        {section.lessons?.map((lesson, lIndex) => (
                                            <div
                                                key={lesson.id}
                                                className="px-6 py-3 flex items-center gap-3 bg-white/[0.01] border-t border-white/5"
                                            >
                        <span className="text-xs text-white/20 font-mono w-8">
                          {String(sIndex + 1)}.{lIndex + 1}
                        </span>
                                                <span className="text-xs text-white/50">{lesson.title}</span>
                                                {lIndex === 0 && sIndex === 0 && (
                                                    <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                            Preview
                          </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default CourseDetailPage