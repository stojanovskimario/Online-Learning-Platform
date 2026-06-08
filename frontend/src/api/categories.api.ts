import axiosClient from './axiosClient'
import type { Category } from '@/types/course.types'

export const getCategoriesApi = () =>
    axiosClient
        .get<Category[]>('/api/categories')
        .then((res) => res.data)

