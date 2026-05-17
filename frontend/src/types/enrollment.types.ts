export type EnrollmentStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED'

export interface Enrollment {
    id: number
    userId: number
    username: string
    courseId: number
    courseTitle: string
    status: EnrollmentStatus
    expiresAt?: string | null
    createdAt: string
    updatedAt: string
}
