export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Category {
    id: number
    name: string
    description?: string
}

export interface Lesson {
    id: number
    title: string
    markdownContent: string
    videoUrl?: string
    orderIndex: number
}

export interface Section {
    id: number
    title: string
    orderIndex: number
    lessons: Lesson[]
}

export interface Course {
    id: number
    title: string
    description: string
    thumbnailUrl?: string
    category: Category
    price: number
    isPremium: boolean
    status: CourseStatus
    instructorId: number
    sections: Section[]
    createdAt: string
    updatedAt: string
}

export interface PaginatedCourses {
    content: Course[]
    totalElements: number
    totalPages: number
    number: number
    size: number
}

export interface CreateCourseRequest {
    title: string
    description: string
    thumbnailUrl?: string
    categoryId: number
    price: number
    isPremium: boolean
}
