import axiosClient from './axiosClient'
import type { Section } from '@/types/course.types'

export interface CreateSectionRequest {
    title: string
    orderIndex: number
}

export interface CreateLessonRequest {
    title: string
    content: string
    orderIndex: number
}

export const createSectionApi = (courseId: number, data: CreateSectionRequest) =>
    axiosClient
        .post<Section>(`/api/courses/${courseId}/sections`, data)
        .then((res) => res.data)

export const createLessonInSectionApi = (sectionId: number, data: CreateLessonRequest) =>
    axiosClient
        .post(`/api/sections/${sectionId}/lessons`, data)
        .then((res) => res.data)

export const deleteSectionApi = (sectionId: number) =>
    axiosClient
        .delete(`/api/sections/${sectionId}`)
        .then((res) => res.data)

export const deleteLessonApi = (lessonId: number) =>
    axiosClient
        .delete(`/api/lessons/${lessonId}`)
        .then((res) => res.data)