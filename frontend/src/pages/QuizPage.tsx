import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import QuizAttemptSession from '@/components/QuizAttemptSession'
import { useCourse } from '@/hooks/useCourse'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { findCourseQuizLessonId } from '@/lib/courseLessons'
import { useQuiz } from '@/hooks/useQuiz'
const QuizPage = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>()
    const navigate = useNavigate()
    const { data: course } = useCourse(courseId)
    const { data: courseProgress, isLoading: isCourseProgressLoading } = useCourseProgress(courseId)
    const isCourseCompleted = (courseProgress?.percentage ?? 0) >= 100
    const quizLessonQuery = useQuery({
        queryKey: ['course-quiz-lesson', course?.id],
        queryFn: () => findCourseQuizLessonId(course),
        enabled: !!course && isCourseCompleted,
        retry: false,
    })
    const quizLessonId = quizLessonQuery.data ?? undefined
    const quizQuery = useQuiz(quizLessonId ? String(quizLessonId) : undefined, isCourseCompleted && !!quizLessonId)
    const quiz = quizQuery.data
    const resolvedLessonId = quiz?.lessonId ?? quizLessonId
    const isLocked = !isCourseProgressLoading && !isCourseCompleted
    const isLoading = isCourseProgressLoading || quizLessonQuery.isLoading || quizQuery.isLoading

    useEffect(() => {
        if (resolvedLessonId && (!lessonId || Number(lessonId) !== resolvedLessonId)) {
            navigate(`/courses/${courseId}/lessons/${resolvedLessonId}/quiz`, { replace: true })
        }
    }, [courseId, lessonId, navigate, resolvedLessonId])

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                        {'\u2190'} Course
                    </button>
                    <span className="text-white/10">/</span>
                    <span className="text-sm text-white/50 truncate">Quiz</span>
                </header>
            }
        >
            {isLoading && (
                <div className="max-w-3xl animate-pulse space-y-4">
                    <div className="h-8 bg-white/5 rounded w-1/2" />
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                    <div className="h-40 bg-white/5 rounded-xl" />
                </div>
            )}
            {!isLoading && isLocked && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-8 max-w-3xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔒</span>
                        <p className="text-sm font-medium text-white">Quiz locked</p>
                    </div>
                    <p className="text-xs text-white/40 mb-4">You need to complete the course first.</p>
                    <p className="text-xs text-white/30 mb-5">
                        {courseProgress?.completedLessons ?? 0} of {courseProgress?.totalLessons ?? 0} lessons completed
                    </p>
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Course
                    </button>
                </div>
            )}
            {!isLoading && !isLocked && !quiz && !quizQuery.isError && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-8 max-w-3xl">
                    <p className="text-sm font-medium text-white mb-1">No quiz available</p>
                    <p className="text-xs text-white/40 mb-4">We couldn&apos;t find the quiz for this course yet.</p>
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Course
                    </button>
                </div>
            )}
            {!isLoading && !isLocked && quizQuery.isError && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-8 max-w-3xl">
                    <p className="text-sm font-medium text-white mb-1">Quiz unavailable right now</p>
                    <p className="text-xs text-white/40 mb-4">We couldn&apos;t load the quiz for this course.</p>
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Course
                    </button>
                </div>
            )}
            {!isLoading && !isLocked && !quizQuery.isError && quiz && (
                <QuizAttemptSession key={quiz.id} courseId={courseId ?? ''} quiz={quiz} courseTitle={course?.title} />
            )}
        </AppLayout>
    )
}
export default QuizPage
