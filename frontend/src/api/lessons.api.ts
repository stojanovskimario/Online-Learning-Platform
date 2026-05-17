import axiosClient from './axiosClient'
import type { LessonDetail } from '@/types/lesson.types'

export const getLessonsByCourseApi = (courseId: number) =>
    axiosClient
        .get<LessonDetail[]>(`/api/courses/${courseId}/lessons`)
        .then((res) => res.data)
