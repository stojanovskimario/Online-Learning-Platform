import axios from 'axios'
import { getQuizByLessonApi } from '@/api/quiz.api'
import type { Course, Lesson, Section } from '@/types/course.types'
import type { Quiz } from '@/types/quiz.types'

const sortByOrderIndex = <T extends { orderIndex: number; id: number }>(items: T[]) =>
    [...items].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id)

const getSortedSections = (course?: Pick<Course, 'sections'> | null) =>
    sortByOrderIndex((course?.sections ?? []) as Section[])

export const getOrderedCourseLessons = (course?: Pick<Course, 'sections'> | null): Lesson[] =>
    getSortedSections(course).flatMap((section) => sortByOrderIndex(section.lessons ?? []))

export const getFirstIncompleteCourseLessonByCount = (course?: Pick<Course, 'sections'> | null, completedLessons = 0) => {
    const orderedLessons = getOrderedCourseLessons(course)
    return orderedLessons[completedLessons]
}

export const getCourseQuizLesson = (course?: Pick<Course, 'sections'> | null) => {
    const orderedLessons = getOrderedCourseLessons(course)
    return orderedLessons[orderedLessons.length - 1]
}

export const findCourseQuizLessonId = async (course?: Pick<Course, 'sections'> | null): Promise<number | null> => {
    for (const lesson of getOrderedCourseLessons(course)) {
        try {
            await getQuizByLessonApi(lesson.id)
            return lesson.id
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                continue
            }

            throw error
        }
    }

    return null
}

export const findCourseQuiz = async (course?: Pick<Course, 'sections'> | null): Promise<Quiz | null> => {
    const lessonId = await findCourseQuizLessonId(course)
    return lessonId ? getQuizByLessonApi(lessonId) : null
}




