export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE'

export interface AnswerOption {
    id: number
    text: string
    orderIndex: number
}

export interface Question {
    id: number
    type: QuestionType
    text: string
    explanation: string | null
    orderIndex: number
    allowsMultiple: boolean
    answerOptions: AnswerOption[]
}

export interface Quiz {
    id: number
    lessonId: number
    title: string
    passScore: number
    timeLimitSeconds: number | null
    questions: Question[]
}

export interface QuizAttemptSubmission {
    answers: Record<number, number[]>
}

export interface QuizAttemptResult {
    attemptId: number
    quizId: number
    score: number
    correctAnswers: number
    totalQuestions: number
    passed: boolean
    attemptedAt: string
}

