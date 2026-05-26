import axiosClient from './axiosClient'
import type { CourseProgress, LessonProgress } from '@/types/progress.types'

export const completeLessonApi = (lessonId: number) =>
    axiosClient
        .post<LessonProgress>(`/api/progress/${lessonId}/complete`)
        .then((res) => res.data)

export const getLessonProgressApi = (lessonId: number) =>
    axiosClient
        .get<LessonProgress>(`/api/progress/${lessonId}`)
        .then((res) => res.data)

export const getCourseProgressApi = (courseId: number) =>
    axiosClient
        .get<CourseProgress>(`/api/courses/${courseId}/progress`)
        .then((res) => res.data)

export const resetCourseProgressApi = (courseId: number) =>
    axiosClient
        .post<CourseProgress>(`/api/courses/${courseId}/progress/reset`)
        .then((res) => res.data)

