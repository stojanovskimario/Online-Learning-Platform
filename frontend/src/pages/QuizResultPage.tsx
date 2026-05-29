import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import type { QuizAttemptResult } from '@/types/quiz.types'
import { readStoredQuizAttemptResult } from '@/lib/quizAttemptStorage'

const QuizResultPage = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const storedResult = readStoredQuizAttemptResult(courseId)
    const resultState = location.state as { result?: QuizAttemptResult; passScore?: number } | null
    const result = resultState?.result ?? storedResult
    const passScore = resultState?.passScore ?? result?.passScore
    const isPassed = passScore != null ? result?.score != null && result.score >= passScore : result?.passed ?? false
    const statusLabel = isPassed ? 'Passed' : 'Failed'

    useEffect(() => {
        if (!result) {
            navigate(lessonId ? `/courses/${courseId}/lessons/${lessonId}/quiz` : `/courses/${courseId}/quiz`, { replace: true })
        }
    }, [courseId, lessonId, navigate, result])

    if (!result) {
        return null
    }

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate(lessonId ? `/courses/${courseId}/lessons/${lessonId}/quiz` : `/courses/${courseId}/quiz`)}
                        className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                        {'\u2190'} Quiz
                    </button>
                    <span className="text-white/10">/</span>
                    <span className="text-sm text-white/50 truncate">Quiz Result</span>
                </header>
            }
        >
            <div className="max-w-3xl">
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-8 text-center">
                    <span
                        className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                            isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                    >
                        {statusLabel}
                    </span>

                    <div className="mt-6">
                        <p className="text-5xl font-bold text-white">
                            {statusLabel} — {result.score}/100 points
                        </p>
                        <p className="text-sm text-white/50 mt-2">
                            {result.correctAnswers} / {result.totalQuestions} correct
                        </p>
                        <p className="text-xs text-white/30 mt-2">
                            {passScore != null ? `Passing score: ${passScore}` : 'Passing score unavailable.'}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => navigate(`/courses/${courseId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            Back to Course
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(lessonId ? `/courses/${courseId}/lessons/${lessonId}/quiz` : `/courses/${courseId}/quiz`)}
                            className="bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            Restart Quiz
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default QuizResultPage

