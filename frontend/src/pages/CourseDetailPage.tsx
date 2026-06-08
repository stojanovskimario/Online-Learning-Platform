import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import AppLayout from '@/components/AppLayout'
import { useCourse } from '@/hooks/useCourse'
import { useEnrollInCourse } from '@/hooks/useEnrollInCourse'
import { useEnrollmentStatus } from '@/hooks/useEnrollmentStatus'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { getFirstIncompleteCourseLessonByCount } from '@/lib/courseLessons'
import type { RootState } from '@/store/store'

const backendOrigin = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') ?? 'http://localhost:8080'

const CourseDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)
    const { data: course, isLoading, isError } = useCourse(id)
    const { data: isEnrolled, isLoading: isEnrollmentStatusLoading } = useEnrollmentStatus(id)
    const { data: courseProgress, isLoading: isCourseProgressLoading } = useCourseProgress(id, !!isEnrolled)
    const enrollMutation = useEnrollInCourse(id)
    const isPremiumUser = user?.subscriptionTier === 'PREMIUM_MONTHLY' || user?.subscriptionTier === 'PREMIUM_ANNUAL'
    const premiumCourseUnlocked = !!course?.isPremium && isPremiumUser
    const canEnrollInCourse = !course?.isPremium || isPremiumUser

    const handleEnroll = () => {
        enrollMutation.mutate(undefined, {
            onSuccess: () => navigate('/dashboard'),
        })
    }



    const totalLessons = course?.sections?.reduce(
        (acc, section) => acc + (section.lessons?.length ?? 0), 0
    ) ?? 0
    const firstIncompleteLesson = getFirstIncompleteCourseLessonByCount(course, courseProgress?.completedLessons ?? 0)
    const enrollmentErrorMessage = axios.isAxiosError(enrollMutation.error)
        ? enrollMutation.error.response?.data?.message ?? 'Enrollment failed. Please try again.'
        : 'Enrollment failed. Please try again.'
    const thumbnailSrc = course?.thumbnailUrl?.startsWith('/')
        ? `${backendOrigin}${course.thumbnailUrl}`
        : course?.thumbnailUrl

    const renderEnrollmentAction = () => {
        if (isEnrollmentStatusLoading) {
            return (
                <button
                    disabled
                    className="w-full bg-blue-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                    Checking...
                </button>
            )
        }

        if (isEnrolled) {
            return (
                <button
                    onClick={() =>
                        firstIncompleteLesson
                            ? navigate(`/courses/${id}/lessons/${firstIncompleteLesson.id}`)
                            : navigate('/dashboard')
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                    Continue Learning
                </button>
            )
        }

        return (
            <button
                onClick={canEnrollInCourse ? handleEnroll : undefined}
                disabled={!canEnrollInCourse || enrollMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
                {enrollMutation.isPending ? 'Loading...' : canEnrollInCourse ? 'Enroll Now' : 'Premium only'}
            </button>
        )
    }

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate('/courses')}
                        className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                        ← Courses
                    </button>
                    <span className="text-white/10">/</span>
                    <span className="text-sm text-white/50 truncate">{course?.title}</span>
                </header>
            }
        >
                    {isLoading && (
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-white/5 rounded w-1/2" />
                            <div className="h-4 bg-white/5 rounded w-1/3" />
                            <div className="h-32 bg-white/5 rounded-xl" />
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                            <p className="text-red-400 text-sm">Failed to load course.</p>
                        </div>
                    )}

                    {course && (
                        <div className="max-w-3xl">
                            <div className="flex flex-col gap-5 mb-6 md:flex-row md:items-start md:justify-between md:gap-6">
                                <div>
                                    {thumbnailSrc && (
                                        <div className="mb-4 overflow-hidden rounded-xl border border-white/5 bg-white/5">
                                            <img
                                                src={thumbnailSrc}
                                                alt={course.title}
                                                className="h-52 w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-white/5 text-white/40 px-2 py-1 rounded">
                      {course.category?.name ?? 'General'}
                    </span>
                                        {course.isPremium && (
                                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-medium">
                        PRO
                      </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
                                    <p className="text-white/50 text-sm leading-relaxed">{course.description}</p>
                                </div>

                                <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 flex-shrink-0 w-full text-center md:w-52">
                                    <p className="text-2xl font-bold text-white mb-1">
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </p>
                                    <p className="text-xs text-white/30 mb-4">
                                        {totalLessons} lessons · {course.sections?.length ?? 0} sections
                                    </p>
                                    {renderEnrollmentAction()}
                                    {course.isPremium && !isPremiumUser && !isEnrolled && (
                                        <p className="text-white/30 text-xs mt-2">Upgrade to Premium to access this course.</p>
                                    )}
                                    {enrollMutation.isError && (
                                        <p className="text-red-400 text-xs mt-2">{enrollmentErrorMessage}</p>
                                    )}
                                </div>
                            </div>

                            {isEnrolled && (
                                <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 mb-6">
                                    <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                        <div>
                                            <h2 className="text-sm font-semibold text-white">Your Progress</h2>
                                            <p className="text-xs text-white/40 mt-1">
                                                {isCourseProgressLoading
                                                    ? 'Loading progress...'
                                                    : `${courseProgress?.completedLessons ?? 0} out of ${courseProgress?.totalLessons ?? totalLessons} completed lessons`}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-400">
                                            {Math.round(courseProgress?.percentage ?? 0)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{ width: `${courseProgress?.percentage ?? 0}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#13151f] border border-white/5 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5">
                                    <h2 className="text-sm font-semibold text-white">Course Syllabus</h2>
                                </div>

                                {course.sections?.length === 0 && (
                                    <div className="px-6 py-8 text-center">
                                        <p className="text-white/30 text-sm">No sections yet</p>
                                    </div>
                                )}

                                    {course.sections?.map((section, sIndex) => (
                                            <div key={section.id} className="border-b border-white/5 last:border-0">
                                        <div className="px-4 py-4 flex flex-col gap-2 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                        <span className="text-xs text-white/20 font-mono">
                          {String(sIndex + 1).padStart(2, '0')}
                        </span>
                                                <h3 className="text-sm font-medium text-white">{section.title}</h3>
                                            </div>
                                            <span className="text-xs text-white/30">
                        {section.lessons?.length ?? 0} lessons
                      </span>
                                        </div>

                                        {section.lessons?.map((lesson, lIndex) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => {
                                                    if (isEnrolled || premiumCourseUnlocked || (lIndex === 0 && sIndex === 0)) {
                                                        navigate(`/courses/${id}/lessons/${lesson.id}`)
                                                    }
                                                }}
                                                disabled={!isEnrolled && !premiumCourseUnlocked && !(lIndex === 0 && sIndex === 0)}
                                                className="w-full px-4 py-3 flex items-center gap-3 bg-white/[0.01] border-t border-white/5 text-left disabled:cursor-default enabled:hover:bg-white/[0.03] transition-colors sm:px-6"
                                            >
                        <span className="text-xs text-white/20 font-mono w-8">
                          {String(sIndex + 1)}.{lIndex + 1}
                        </span>
                                                <span className="text-xs text-white/50">{lesson.title}</span>
                                                {lIndex === 0 && sIndex === 0 && (
                                                    <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                            Preview
                          </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
        </AppLayout>
    )
}

export default CourseDetailPage
