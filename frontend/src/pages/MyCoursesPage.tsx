import { useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import AppLayout from '@/components/AppLayout'
import { getCourseByIdApi } from '@/api/courses.api'
import { getCourseProgressApi } from '@/api/progress.api'
import { useMyEnrollments } from '@/hooks/useMyEnrollments'
import { useResetCourseProgress } from '@/hooks/useResetCourseProgress'
import { getFirstIncompleteCourseLessonByCount } from '@/lib/courseLessons'

const MyCoursesPage = () => {
    const navigate = useNavigate()
    const { data, isLoading, isError } = useMyEnrollments()

    const activeEnrollments = data?.filter((enrollment) => enrollment.status === 'ACTIVE') ?? []
    const resetProgressMutation = useResetCourseProgress()
    const progressQueries = useQueries({
        queries: activeEnrollments.map((enrollment) => ({
            queryKey: ['course-progress', String(enrollment.courseId)],
            queryFn: () => getCourseProgressApi(enrollment.courseId),
        })),
    })
    const courseQueries = useQueries({
        queries: activeEnrollments.map((enrollment) => ({
            queryKey: ['course', String(enrollment.courseId)],
            queryFn: () => getCourseByIdApi(enrollment.courseId),
        })),
    })

    const isCardsLoading = progressQueries.some((query) => query.isLoading) || courseQueries.some((query) => query.isLoading)
    const hasCardsError = progressQueries.some((query) => query.isError) || courseQueries.some((query) => query.isError)

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
            {(isLoading || isCardsLoading) && (
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

            {(isError || hasCardsError) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400 text-sm">Failed to load your courses. Please try again.</p>
                </div>
            )}

            {!isLoading && !isCardsLoading && !isError && !hasCardsError && activeEnrollments.length === 0 && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-12 text-center">
                    <p className="text-2xl mb-3">◐</p>
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

            {!isLoading && !isCardsLoading && !isError && !hasCardsError && activeEnrollments.length > 0 && (
                <>
                    <p className="text-xs text-white/30 mb-4">
                        {activeEnrollments.length} active {activeEnrollments.length === 1 ? 'course' : 'courses'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeEnrollments.map((enrollment, index) => {
                            const progress = progressQueries[index]?.data
                            const course = courseQueries[index]?.data
                            const isCompleted = (progress?.percentage ?? 0) >= 100
                            const firstLesson = getFirstIncompleteCourseLessonByCount(course, 0)
                            const firstIncompleteLesson = getFirstIncompleteCourseLessonByCount(course, progress?.completedLessons ?? 0)
                            const isRestarting = resetProgressMutation.isPending && resetProgressMutation.variables === enrollment.courseId

                            const handleCourseAction = () => {
                                if (isCompleted) {
                                    if (firstLesson) {
                                        resetProgressMutation.mutate(enrollment.courseId, {
                                            onSuccess: () => navigate(`/courses/${enrollment.courseId}/lessons/${firstLesson.id}`),
                                        })
                                        return
                                    }

                                    resetProgressMutation.mutate(enrollment.courseId, {
                                        onSuccess: () => navigate(`/courses/${enrollment.courseId}`),
                                    })
                                    return
                                }

                                if (firstIncompleteLesson) {
                                    navigate(`/courses/${enrollment.courseId}/lessons/${firstIncompleteLesson.id}`)
                                    return
                                }

                                navigate(`/courses/${enrollment.courseId}`)
                            }

                            return (
                                <div key={enrollment.id} className="bg-[#13151f] border border-white/5 rounded-xl p-5">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Course</p>
                                            <h2 className="text-sm font-semibold text-white">{enrollment.courseTitle}</h2>
                                        </div>
                                        <span
                                            className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                                                isCompleted
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-blue-500/15 text-blue-400'
                                            }`}
                                        >
                                            {isCompleted ? 'Completed' : 'Active'}
                                        </span>
                                    </div>

                                    <p className="text-xs text-white/35 mb-4">
                                        {progress?.completedLessons ?? 0} out of {progress?.totalLessons ?? 0} completed lessons
                                    </p>

                                    <button
                                        onClick={handleCourseAction}
                                        disabled={isRestarting}
                                        className={`w-full text-white text-sm font-medium py-2.5 rounded-lg transition-colors ${
                                            isCompleted ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {isRestarting
                                            ? 'Restarting…'
                                            : isCompleted
                                                ? 'Restart Learning'
                                                : 'Continue Learning'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </AppLayout>
    )
}

export default MyCoursesPage
