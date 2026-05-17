import axiosClient from './axiosClient'
import type { Enrollment } from '@/types/enrollment.types'

export const enrollInCourseApi = (courseId: number) =>
    axiosClient
        .post(`/api/enrollments/courses/${courseId}/enroll`)
        .then((res) => res.data)

export const getEnrollmentStatusApi = (courseId: number) =>
    axiosClient
        .get<boolean>(`/api/enrollments/courses/${courseId}/status`)
        .then((res) => res.data)

export const getMyEnrollmentsApi = () =>
    axiosClient
        .get<Enrollment[]>('/api/enrollments/my-enrollments')
        .then((res) => res.data)
