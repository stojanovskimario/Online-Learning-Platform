export interface LessonProgress {
    lessonId: number
    userId: number
    completed: boolean
    completedAt?: string | null
}

export interface CourseProgress {
    courseId: number
    completedLessons: number
    totalLessons: number
    percentage: number
}
