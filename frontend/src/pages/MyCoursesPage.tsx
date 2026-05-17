import { useNavigate } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import { useMyEnrollments } from '@/hooks/useMyEnrollments'

const MyCoursesPage = () => {
    const navigate = useNavigate()
    const { data, isLoading, isError } = useMyEnrollments()

    const activeEnrollments = data?.filter((enrollment) => enrollment.status === 'ACTIVE') ?? []

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">My Courses</h1>
                        <p className="text-xs text-white/40">Continue learning from your enrolled courses</p>
                    </div>
                </header>
            }
        >
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-[#13151f] border border-white/5 rounded-xl p-5 animate-pulse">
                            <div className="h-4 bg-white/5 rounded mb-3 w-2/3" />
                            <div className="h-3 bg-white/5 rounded mb-5 w-1/3" />
                            <div className="h-9 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400 text-sm">Failed to load your courses. Please try again.</p>
                </div>
            )}

            {!isLoading && !isError && activeEnrollments.length === 0 && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-12 text-center">
                    <p className="text-2xl mb-3">{'\u25ce'}</p>
                    <p className="text-sm font-medium text-white/60 mb-1">No enrolled courses yet</p>
                    <p className="text-xs text-white/30 mb-4">Enroll in a free course to start learning</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Explore Courses
                    </button>
                </div>
            )}

            {activeEnrollments.length > 0 && (
                <>
                    <p className="text-xs text-white/30 mb-4">
                        {activeEnrollments.length} active {activeEnrollments.length === 1 ? 'course' : 'courses'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeEnrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="bg-[#13151f] border border-white/5 rounded-xl p-5"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Course</p>
                                        <h2 className="text-sm font-semibold text-white">{enrollment.courseTitle}</h2>
                                    </div>
                                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-full font-medium">
                                        Active
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate(`/courses/${enrollment.courseId}`)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                                >
                                    Continue Learning
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </AppLayout>
    )
}

export default MyCoursesPage
