import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import { useCourse } from '@/hooks/useCourse'
import { useCourseLessons } from '@/hooks/useCourseLessons'
import { useLessonProgress } from '@/hooks/useLessonProgress'
import { useCompleteLesson } from '@/hooks/useCompleteLesson'

const LessonPage = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
    const navigate = useNavigate()
    const { data: course } = useCourse(courseId)
    const { data: lessons, isLoading, isError } = useCourseLessons(courseId)
    const { data: lessonProgress, isLoading: isLessonProgressLoading } = useLessonProgress(lessonId)
    const completeLessonMutation = useCompleteLesson(lessonId, courseId)

    const currentLessonIndex = useMemo(
        () => lessons?.findIndex((lesson) => lesson.id === Number(lessonId)) ?? -1,
        [lessonId, lessons]
    )

    const currentLesson = currentLessonIndex >= 0 ? lessons?.[currentLessonIndex] : undefined
    const previousLesson = currentLessonIndex > 0 ? lessons?.[currentLessonIndex - 1] : undefined
    const nextLesson =
        lessons && currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1
            ? lessons[currentLessonIndex + 1]
            : undefined

    const navigateToLesson = (targetLessonId: number) => {
        navigate(`/courses/${courseId}/lessons/${targetLessonId}`)
    }

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-8 py-4 flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                        {'\u2190'} Course
                    </button>
                    <span className="text-white/10">/</span>
                    <span className="text-sm text-white/50 truncate">{course?.title ?? 'Lesson'}</span>
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

            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400 text-sm">Failed to load lesson.</p>
                </div>
            )}

            {!isLoading && !isError && !currentLesson && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-8 max-w-3xl">
                    <p className="text-sm font-medium text-white mb-1">Lesson not found</p>
                    <p className="text-xs text-white/40 mb-4">The requested lesson does not exist in this course.</p>
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Course
                    </button>
                </div>
            )}

            {currentLesson && (
                <div className="max-w-3xl">
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest text-white/25 mb-2">
                            Lesson {currentLessonIndex + 1} of {lessons?.length}
                        </p>
                        <h1 className="text-2xl font-bold text-white">{currentLesson.title}</h1>
                    </div>

                    {currentLesson.videoUrl && (
                        <div className="bg-[#13151f] border border-white/5 rounded-xl p-4 mb-6">
                            <a
                                href={currentLesson.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Open lesson video {'\u2192'}
                            </a>
                        </div>
                    )}

                    <article className="bg-[#13151f] border border-white/5 rounded-xl p-6 whitespace-pre-wrap leading-7 text-sm text-white/70">
                        {currentLesson.content}
                    </article>

                    <div className="mt-6">
                        <button
                            onClick={() => completeLessonMutation.mutate()}
                            disabled={
                                isLessonProgressLoading ||
                                lessonProgress?.completed ||
                                completeLessonMutation.isPending
                            }
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            {isLessonProgressLoading
                                ? 'Checking completion...'
                                : lessonProgress?.completed
                                    ? 'Completed'
                                    : completeLessonMutation.isPending
                                        ? 'Marking complete...'
                                        : 'Mark as Complete'}
                        </button>
                        {completeLessonMutation.isError && (
                            <p className="text-red-400 text-xs mt-2">Could not mark lesson complete. Please try again.</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-6">
                        <button
                            onClick={() => previousLesson && navigateToLesson(previousLesson.id)}
                            disabled={!previousLesson}
                            className="bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            {'\u2190'} Previous Lesson
                        </button>
                        <button
                            onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
                            disabled={!nextLesson}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            Next Lesson {'\u2192'}
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default LessonPage
