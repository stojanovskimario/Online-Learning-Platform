import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import type { QuizAttemptResult } from '@/types/quiz.types'

const QuizResultPage = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const result = (location.state as { result?: QuizAttemptResult } | null)?.result

    useEffect(() => {
        if (!result) {
            navigate(`/courses/${courseId}/lessons/${lessonId}/quiz`, { replace: true })
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
                        onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                        className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                        {'\u2190'} Lesson
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
                            result.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                    >
                        {result.passed ? 'PASSED' : 'FAILED'}
                    </span>

                    <div className="mt-6">
                        <p className="text-5xl font-bold text-white">{result.score}%</p>
                        <p className="text-sm text-white/50 mt-2">
                            {result.correctAnswers} / {result.totalQuestions} correct
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            Back to Lesson
                        </button>

                        {!result.passed && (
                            <button
                                type="button"
                                onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}/quiz`)}
                                className="bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                            >
                                Retry Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default QuizResultPage

