import { useQueries } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCourseByIdApi } from '@/api/courses.api'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { getCourseProgressApi } from '@/api/progress.api'
import { useMyEnrollments } from '@/hooks/useMyEnrollments'
import { readStoredQuizAttemptResult } from '@/lib/quizAttemptStorage'

const QuizzesPage = () => {
    const navigate = useNavigate()
    const { data: enrollments, isLoading, isError } = useMyEnrollments()
    const activeEnrollments = enrollments?.filter((enrollment) => enrollment.status === 'ACTIVE') ?? []
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

    const enrollmentsWithProgress = activeEnrollments.map((enrollment, index) => {
        const progress = progressQueries[index]?.data
        const isCompletedCourse = (progress?.percentage ?? 0) >= 100
        const storedResult = readStoredQuizAttemptResult(enrollment.courseId)

        return {
            enrollment,
            progress,
            isCompletedCourse,
            storedResult,
        }
    })

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Quizzes</h1>
                        <p className="text-xs text-white/40">Unlock quizzes after completing each course</p>
                    </div>
                </header>
            }
        >
            {(isLoading || isCardsLoading) && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-[#13151f] border border-white/5 rounded-xl p-5 animate-pulse">
                            <div className="h-4 bg-white/5 rounded mb-3 w-2/3" />
                            <div className="h-3 bg-white/5 rounded mb-5 w-1/2" />
                            <div className="h-9 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {(isError || hasCardsError) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400 text-sm">Failed to load quizzes. Please try again.</p>
                </div>
            )}

            {!isLoading && !isCardsLoading && !isError && !hasCardsError && activeEnrollments.length === 0 && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-12 text-center">
                    <p className="text-2xl mb-3">◈</p>
                    <p className="text-sm font-medium text-white/60 mb-1">No quizzes available yet</p>
                    <p className="text-xs text-white/30 mb-4">Enroll in a course and complete it to unlock the quiz</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Explore Courses
                    </button>
                </div>
            )}

            {!isLoading && !isCardsLoading && !isError && !hasCardsError && activeEnrollments.length > 0 && (
                <div className="space-y-4">
                    <p className="text-xs text-white/30">
                        {activeEnrollments.length} active {activeEnrollments.length === 1 ? 'course' : 'courses'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrollmentsWithProgress.map(({ enrollment, progress, isCompletedCourse, storedResult }) => {
                            const isUnlocked = isCompletedCourse

                            return (
                                <div
                                    key={enrollment.id}
                                    onClick={() => {
                                        if (isUnlocked) {
                                            navigate(`/courses/${enrollment.courseId}/quiz`)
                                        }
                                    }}
                                    className={`bg-[#13151f] border border-white/5 rounded-xl p-5 transition-all ${
                                        isUnlocked
                                            ? 'cursor-pointer hover:border-blue-500/30 hover:bg-white/[0.02]'
                                            : 'opacity-80'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Quiz</p>
                                            <h2 className="text-sm font-semibold text-white">Final Quiz</h2>
                                            <p className="text-xs text-white/30 mt-1">{enrollment.courseTitle}</p>
                                        </div>
                                        <span
                                            className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                                                isUnlocked
                                                    ? storedResult
                                                        ? storedResult.passed
                                                            ? 'bg-emerald-500/15 text-emerald-400'
                                                            : 'bg-red-500/15 text-red-400'
                                                        : 'bg-indigo-500/15 text-indigo-400'
                                                    : 'bg-white/5 text-white/30'
                                            }`}
                                        >
                                            {isUnlocked ? (storedResult ? (storedResult.passed ? 'Passed' : 'Failed') : 'Ready') : 'Locked'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-5">
                                        {!isUnlocked && (
                                            <p className="text-xs text-white/40 flex items-center gap-2">
                                                <span>🔒</span>
                                                You need to complete the course first.
                                            </p>
                                        )}

                                        {isUnlocked && storedResult && (
                                            <p className={`text-xs ${storedResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {storedResult.passed ? 'Passed' : 'Failed'} — {storedResult.score}/100 points · {storedResult.correctAnswers}/{storedResult.totalQuestions} correct
                                            </p>
                                        )}

                                        {isUnlocked && !storedResult && (
                                            <p className="text-xs text-white/40">Available now that the course is complete.</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-white/30">
                                            {progress?.completedLessons ?? 0} / {progress?.totalLessons ?? 0} lessons completed
                                        </p>

                                        <Button
                                            size="sm"
                                            variant={isUnlocked ? 'default' : 'secondary'}
                                            disabled={!isUnlocked}
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                if (isUnlocked) {
                                                    navigate(`/courses/${enrollment.courseId}/quiz`)
                                                }
                                            }}
                                            className={isUnlocked ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                                        >
                                            {storedResult ? 'Restart Quiz' : 'Take Quiz'}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default QuizzesPage

