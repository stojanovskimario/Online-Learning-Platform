export interface LessonDetail {
    id: number
    courseId: number
    sectionId: number
    title: string
    content: string
    orderIndex: number
    videoUrl?: string | null
}
