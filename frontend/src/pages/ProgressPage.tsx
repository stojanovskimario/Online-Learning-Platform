import { useQueries } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import { getCourseProgressApi } from '@/api/progress.api'
import { useMyEnrollments } from '@/hooks/useMyEnrollments'

const ProgressPage = () => {
    const navigate = useNavigate()
    const { data: enrollments, isLoading, isError } = useMyEnrollments()
    const activeEnrollments = enrollments?.filter((enrollment) => enrollment.status === 'ACTIVE') ?? []

    const progressQueries = useQueries({
        queries: activeEnrollments.map((enrollment) => ({
            queryKey: ['course-progress', String(enrollment.courseId)],
            queryFn: () => getCourseProgressApi(enrollment.courseId),
        })),
    })

    const isProgressLoading = progressQueries.some((query) => query.isLoading)
    const hasProgressError = progressQueries.some((query) => query.isError)

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-8 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Progress</h1>
                        <p className="text-xs text-white/40">Track your enrolled course completion</p>
                    </div>
                </header>
            }
        >
            {(isLoading || isProgressLoading) && (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-[#13151f] border border-white/5 rounded-xl p-5 animate-pulse">
                            <div className="h-4 bg-white/5 rounded mb-3 w-1/3" />
                            <div className="h-3 bg-white/5 rounded mb-4 w-1/4" />
                            <div className="h-2 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {(isError || hasProgressError) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400 text-sm">Failed to load progress. Please try again.</p>
                </div>
            )}

            {!isLoading && !isProgressLoading && !isError && !hasProgressError && activeEnrollments.length === 0 && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-12 text-center">
                    <p className="text-2xl mb-3">{'\u25d0'}</p>
                    <p className="text-sm font-medium text-white/60 mb-1">No progress yet</p>
                    <p className="text-xs text-white/30 mb-4">Enroll in a course to start tracking your progress</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Explore Courses
                    </button>
                </div>
            )}

            {!isLoading && !isProgressLoading && !isError && !hasProgressError && activeEnrollments.length > 0 && (
                <div className="space-y-4">
                    {activeEnrollments.map((enrollment, index) => {
                        const progress = progressQueries[index]?.data
                        const percentage = progress?.percentage ?? 0

                        return (
                            <div
                                key={enrollment.id}
                                className="bg-[#13151f] border border-white/5 rounded-xl p-5"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h2 className="text-sm font-semibold text-white mb-1">{enrollment.courseTitle}</h2>
                                        <p className="text-xs text-white/40">
                                            {progress?.completedLessons ?? 0} out of {progress?.totalLessons ?? 0} completed lessons
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-400">
                                        {Math.round(percentage)}%
                                    </span>
                                </div>

                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </AppLayout>
    )
}

export default ProgressPage
