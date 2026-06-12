import { useQueries } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { getCourseByIdApi } from '@/api/courses.api'
import { getCourseProgressApi } from '@/api/progress.api'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useMyEnrollments } from '@/hooks/useMyEnrollments'
import { useResetCourseProgress } from '@/hooks/useResetCourseProgress'
import { getFirstIncompleteCourseLessonByCount } from '@/lib/courseLessons'
import { clearStoredQuizAttemptResult } from '@/lib/quizAttemptStorage'
import { useCertificates } from '@/hooks/useCertificates'
import { useRecentQuizAttempts } from '@/hooks/useRecentQuizAttempts'
import { CheckCircle } from 'lucide-react'
const DashboardPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { data: enrollments, isLoading: isEnrollmentsLoading, isError: isEnrollmentsError } = useMyEnrollments()
    const activeEnrollments = enrollments?.filter((enrollment) => enrollment.status === 'ACTIVE') ?? []
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
    const isProgressLoading = progressQueries.some((query) => query.isLoading)
    const isCourseLoading = courseQueries.some((query) => query.isLoading)
    const hasProgressError = progressQueries.some((query) => query.isError)
    const hasCourseError = courseQueries.some((query) => query.isError)
    const enrollmentProgress = activeEnrollments.map((enrollment, index) => ({
        enrollment,
        progress: progressQueries[index]?.data,
        course: courseQueries[index]?.data,
    }))
    const completedCoursesCount = enrollmentProgress.filter(({ progress }) => (progress?.percentage ?? 0) >= 100).length
    const isDashboardDataLoading = isEnrollmentsLoading || isProgressLoading || isCourseLoading
    const hasDashboardDataError = isEnrollmentsError || hasProgressError || hasCourseError
    const { data: certificates, isLoading: isCertificatesLoading } = useCertificates()
    const { data: recentAttempts, isLoading: isRecentAttemptsLoading } = useRecentQuizAttempts()
    const certificateList = certificates ?? []

    const stats = [
        {
            label: 'Enrolled Courses',
            value: isDashboardDataLoading ? '...' : String(activeEnrollments.length),
            sub: activeEnrollments.length === 1 ? 'course active' : 'courses active',
        },
        {
            label: 'Completed',
            value: isDashboardDataLoading ? '...' : String(completedCoursesCount),
            sub: completedCoursesCount === 1 ? 'course done' : 'courses done',
        },
        { label: 'Quizzes Passed', value: '0', sub: 'avg score -' },
        {
            label: 'Certificates',
            value: isCertificatesLoading ? '...' : String(certificateList.length),
            sub: certificateList.length === 1 ? 'certificate earned' : 'certificates earned',
        },
    ]
    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                        <p className="text-xs text-white/40">Welcome back, {user?.firstName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                user?.subscriptionTier === 'FREE' ? 'bg-white/5 text-white/40' : 'bg-blue-500/20 text-blue-400'
                            }`}
                        >
                            {user?.subscriptionTier === 'FREE' ? 'Free Plan' : 'Premium'}
                        </span>
                    </div>
                </header>
            }
        >
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4 xl:mb-8">
                {stats.map((stat) => (
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
                        <Link to="/courses/my" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            View all
                        </Link>
                    </div>
                    {isDashboardDataLoading && (
                        <div className="space-y-4">
                            {[...Array(2)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="h-4 bg-white/5 rounded mb-3 w-1/2" />
                                    <div className="h-2 bg-white/5 rounded" />
                                </div>
                            ))}
                        </div>
                    )}
                    {hasDashboardDataError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-red-400 text-xs">Failed to load dashboard courses.</p>
                        </div>
                    )}
                    {!isDashboardDataLoading && !hasDashboardDataError && activeEnrollments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl mb-4">◎</div>
                            <p className="text-sm font-medium text-white/60 mb-1">No courses yet</p>
                            <p className="text-xs text-white/30 mb-4">Browse the catalogue and enrol in your first course</p>
                            <Button size="sm" onClick={() => navigate('/courses')} className="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                                Explore Courses
                            </Button>
                        </div>
                    )}
                    {!isDashboardDataLoading && !hasDashboardDataError && activeEnrollments.length > 0 && (
                        <div className="space-y-4">
                            {enrollmentProgress.map(({ enrollment, progress, course }) => {
                                const isCompleted = (progress?.percentage ?? 0) >= 100
                                const firstIncompleteLesson = getFirstIncompleteCourseLessonByCount(course, progress?.completedLessons ?? 0)
                                const firstLesson = getFirstIncompleteCourseLessonByCount(course, 0)
                                const isRestarting = resetProgressMutation.isPending && resetProgressMutation.variables === enrollment.courseId
                                const handleCourseAction = () => {
                                    if (isCompleted) {
                                        if (!firstLesson) {
                                            return
                                        }
                                        resetProgressMutation.mutate(enrollment.courseId, {
                                            onSuccess: () => {
                                                clearStoredQuizAttemptResult(enrollment.courseId)
                                                navigate(`/courses/${enrollment.courseId}/lessons/${firstLesson.id}`)
                                            },
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
                                    <button key={enrollment.id} onClick={handleCourseAction} disabled={isRestarting} className="w-full text-left disabled:opacity-60">
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <p className="text-sm font-medium text-white">{enrollment.courseTitle}</p>
                                            <span
                                                className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                                                    isCompleted ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                                                }`}
                                            >
                                                {isCompleted ? 'Completed' : 'Active'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/35 mb-2">
                                            {progress?.completedLessons ?? 0} out of {progress?.totalLessons ?? 0} completed lessons
                                        </p>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress?.percentage ?? 0}%` }} />
                                        </div>
                                        <span className={`text-xs font-medium ${isCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>
                                            {isRestarting
                                                ? 'Restarting…'
                                                : isCompleted
                                                    ? 'Restart Course →'
                                                    : 'Continue Learning →'}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="bg-[#13151f] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white">Certificates</h2>
                            <Link to="/certificates" className="text-xs text-blue-400 hover:text-blue-300">
                                View all
                            </Link>
                        </div>
                                <div>
                                    {isCertificatesLoading ? (
                                        <div className="space-y-2">
                                            <div className="animate-pulse bg-white/5 rounded h-8 w-full" />
                                            <div className="animate-pulse bg-white/5 rounded h-8 w-full" />
                                        </div>
                                    ) : certificateList.length === 0 ? (
                                        <div className="text-center py-6">
                                            <p className="text-3xl mb-2">Certificates</p>
                                            <p className="text-xs text-white/30">No certificates yet</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {certificateList.slice(0, 3).map((c) => (
                                                <div key={c.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                                    <div className="min-w-0">
                                                        <div className="text-white text-sm font-medium truncate">{c.courseTitle}</div>
                                                        <div className="text-white/40 text-xs">{new Date(c.issuedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                    </div>
                                                    <CheckCircle size={16} className="text-emerald-400 ml-4" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                    </div>
                            <div className="bg-[#13151f] border border-white/5 rounded-xl p-6">
                                <h2 className="text-sm font-semibold text-white mb-4">Recent Quizzes</h2>
                                {isRecentAttemptsLoading ? (
                                    <div className="space-y-2">
                                        <div className="animate-pulse bg-white/5 rounded h-8 w-full" />
                                        <div className="animate-pulse bg-white/5 rounded h-8 w-full" />
                                    </div>
                                ) : !recentAttempts || recentAttempts.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-3xl mb-2">Quizzes</p>
                                        <p className="text-xs text-white/30">No quizzes taken yet</p>
                                    </div>
                                ) : (
                                    <div>
                                        {recentAttempts.slice(0, 3).map((attempt) => (
                                            <div key={attempt.attemptId} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                                <div className="min-w-0">
                                                    <div className="text-white text-sm font-medium truncate">{attempt.quizTitle}</div>
                                                    <div className="text-white/40 text-xs truncate">{attempt.courseTitle}</div>
                                                </div>
                                                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${attempt.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {attempt.score}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                </div>
            </div>
            {user?.subscriptionTier === 'FREE' && (
                <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-blue-400 font-medium mb-1">PREMIUM PLAN</p>
                        <p className="text-sm font-semibold text-white">Unlock all courses & advanced features</p>
                        <p className="text-xs text-white/40 mt-1">Unlimited quiz retakes, AI assistant, certificates - $9/mo</p>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex-shrink-0 sm:ml-6" onClick={() => navigate('/billing')}>
                        Upgrade to Premium
                    </Button>
                </div>
            )}
        </AppLayout>
    )
}
export default DashboardPage
