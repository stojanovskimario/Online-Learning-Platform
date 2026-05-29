import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSubmitQuiz } from '@/hooks/useSubmitQuiz'
import { saveStoredQuizAttemptResult } from '@/lib/quizAttemptStorage'
import type { AnswerOption, Quiz } from '@/types/quiz.types'

const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds)
    const minutes = Math.floor(safeSeconds / 60)
    const remainingSeconds = safeSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

interface QuizAttemptSessionProps {
    courseId: string
    quiz: Quiz
    courseTitle?: string
}

const QuizAttemptSession = ({ courseId, quiz, courseTitle }: QuizAttemptSessionProps) => {
    const navigate = useNavigate()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, number[]>>({})
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(quiz.timeLimitSeconds)
    const [inlineError, setInlineError] = useState<string | null>(null)
    const hasAutoSubmittedRef = useRef(false)
    const submitQuizMutation = useSubmitQuiz(quiz.id)

    useEffect(() => {
        if (remainingSeconds == null || remainingSeconds <= 0 || submitQuizMutation.isPending) {
            return
        }

        const timerId = window.setInterval(() => {
            setRemainingSeconds((current) => {
                if (current == null) {
                    return current
                }

                if (current <= 1) {
                    window.clearInterval(timerId)
                    return 0
                }

                return current - 1
            })
        }, 1000)

        return () => window.clearInterval(timerId)
    }, [remainingSeconds, submitQuizMutation.isPending])

    const questions = quiz.questions ?? []
    const currentQuestion = questions[currentQuestionIndex]
    const totalQuestions = questions.length
    const currentAnswers = currentQuestion ? (answers[currentQuestion.id] ?? []) : []
    const currentQuestionNumber = Math.min(currentQuestionIndex + 1, totalQuestions || 1)

    const handleRadioSelect = (questionId: number, optionId: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: [optionId] }))
        setInlineError(null)
    }

    const handleCheckboxToggle = (questionId: number, optionId: number) => {
        setAnswers((prev) => {
            const current = prev[questionId] ?? []
            const alreadySelected = current.includes(optionId)

            return {
                ...prev,
                [questionId]: alreadySelected ? current.filter((id) => id !== optionId) : [...current, optionId],
            }
        })
        setInlineError(null)
    }

    const submitQuiz = useCallback(async () => {
        if (submitQuizMutation.isPending || hasAutoSubmittedRef.current) {
            return
        }

        hasAutoSubmittedRef.current = true
        setInlineError(null)

        try {
            const result = await submitQuizMutation.mutateAsync({ answers })
            const resultWithPassScore = { ...result, passScore: quiz.passScore }
            saveStoredQuizAttemptResult(courseId, resultWithPassScore)
            navigate(`/courses/${courseId}/lessons/${quiz.lessonId}/quiz/result`, {
                state: { result: resultWithPassScore },
            })
        } catch (error) {
            hasAutoSubmittedRef.current = false

            if (axios.isAxiosError(error) && error.response?.status === 429) {
                setInlineError("You've reached the 3-attempt limit for today. Try again tomorrow.")
                return
            }

            setInlineError('Something went wrong. Please try again.')
        }
    }, [answers, courseId, navigate, submitQuizMutation])

    useEffect(() => {
        if (remainingSeconds === 0 && !submitQuizMutation.isPending && !hasAutoSubmittedRef.current) {
            submitQuiz()
        }
    }, [remainingSeconds, submitQuiz, submitQuizMutation.isPending])

    const handleNext = () => {
        if (!currentQuestion || currentAnswers.length === 0) {
            return
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((current) => current + 1)
            return
        }

        submitQuiz()
    }

    const isSubmitting = submitQuizMutation.isPending

    return (
        <div className="max-w-3xl">
            <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 mb-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-white/25 mb-2">
                            Question {currentQuestionNumber} of {totalQuestions}
                        </p>
                        <h1 className="text-2xl font-bold text-white">{courseTitle ?? quiz.title}</h1>
                        <p className="text-xs text-white/40 mt-1">Final course quiz</p>
                    </div>

                    {quiz.timeLimitSeconds != null && remainingSeconds != null && (
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-widest text-white/25 mb-1">Time Remaining</p>
                            <p className="text-lg font-semibold text-white">{formatTime(remainingSeconds)}</p>
                        </div>
                    )}
                </div>
            </div>

            {currentQuestion && (
                <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 sm:p-6">
                    <div className="mb-5">
                        <p className="text-base font-medium text-white">{currentQuestion.text}</p>
                        {currentQuestion.allowsMultiple && (
                            <p className="mt-1 mb-4 text-xs text-blue-400/70">Select all that apply</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        {[...currentQuestion.answerOptions]
                            .sort((a: AnswerOption, b: AnswerOption) => a.orderIndex - b.orderIndex)
                            .map((option) => {
                                const isSelected = currentAnswers.includes(option.id)

                                if (currentQuestion.allowsMultiple) {
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => handleCheckboxToggle(currentQuestion.id, option.id)}
                                            className={`rounded-lg border p-3 text-sm text-white cursor-pointer transition-colors w-full text-left flex items-center gap-3 ${
                                                isSelected
                                                    ? 'bg-blue-500/20 border-blue-500/50'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            <span
                                                className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                                                }`}
                                            >
                                                {isSelected && (
                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                                        <path
                                                            d="M1.5 5l2.5 2.5 4.5-4.5"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            {option.text}
                                        </button>
                                    )
                                }

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleRadioSelect(currentQuestion.id, option.id)}
                                        className={`rounded-lg border p-3 text-sm text-white cursor-pointer transition-colors w-full text-left flex items-center gap-3 ${
                                            isSelected
                                                ? 'bg-blue-500/20 border-blue-500/50'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                                                isSelected ? 'border-blue-500' : 'border-white/30'
                                            }`}
                                        >
                                            {isSelected && <span className="w-2 h-2 bg-blue-500 rounded-full block" />}
                                        </span>
                                        {option.text}
                                    </button>
                                )
                            })}
                    </div>

                    {inlineError && <p className="text-red-400 text-xs mt-4">{inlineError}</p>}

                    <div className="mt-6 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setCurrentQuestionIndex((current) => Math.max(0, current - 1))}
                            disabled={currentQuestionIndex === 0 || isSubmitting}
                            className="bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            {'\u2190'} Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={currentAnswers.length === 0 || isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                            {isSubmitting
                                ? 'Submitting...'
                                : currentQuestionIndex === totalQuestions - 1
                                    ? 'Submit Quiz'
                                    : 'Next'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizAttemptSession




