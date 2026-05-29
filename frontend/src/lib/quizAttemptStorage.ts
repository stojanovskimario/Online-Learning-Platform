import type { QuizAttemptResult } from '@/types/quiz.types'

const QUIZ_ATTEMPT_RESULT_PREFIX = 'learnix:quiz-attempt-result:'

const getQuizAttemptResultKey = (courseId: number | string) => `${QUIZ_ATTEMPT_RESULT_PREFIX}${courseId}`

export const readStoredQuizAttemptResult = (courseId?: number | string): QuizAttemptResult | null => {
    if (courseId == null || typeof window === 'undefined') {
        return null
    }

    const rawValue = window.localStorage.getItem(getQuizAttemptResultKey(courseId))
    if (!rawValue) {
        return null
    }

    try {
        return JSON.parse(rawValue) as QuizAttemptResult
    } catch {
        return null
    }
}

export const saveStoredQuizAttemptResult = (courseId: number | string, result: QuizAttemptResult) => {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.setItem(getQuizAttemptResultKey(courseId), JSON.stringify(result))
}

export const clearStoredQuizAttemptResult = (courseId: number | string) => {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.removeItem(getQuizAttemptResultKey(courseId))
}

