import axiosClient from './axiosClient'
import type { Course, PaginatedCourses } from '@/types/course.types'


export const getCoursesApi = (page = 0, size = 20) =>
    axiosClient
        .get<PaginatedCourses>(`/api/courses?page=${page}&size=${size}`)
        .then((res) => res.data)

export const getCourseByIdApi = (id: number) =>
    axiosClient
        .get<Course>(`/api/courses/${id}`)
        .then((res) => res.data)

export const publishCourseApi = (id: number) =>
    axiosClient
        .put<Course>(`/api/courses/${id}/publish`)
        .then((res) => res.data)