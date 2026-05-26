import { useNavigate } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import { useCourses } from '@/hooks/useCourses'

const backendOrigin = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') ?? 'http://localhost:8080'

const CoursesPage = () => {
    const navigate = useNavigate()

    const { data, isLoading, isError } = useCourses()



    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Explore Courses</h1>
                        <p className="text-xs text-white/40">Browse and enrol in courses</p>
                    </div>
                </header>
            }
        >
                    {isLoading && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-[#13151f] border border-white/5 rounded-xl p-5 animate-pulse">
                                    <div className="h-32 bg-white/5 rounded-lg mb-4" />
                                    <div className="h-4 bg-white/5 rounded mb-2" />
                                    <div className="h-3 bg-white/5 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                            <p className="text-red-400 text-sm">Failed to load courses. Please try again.</p>
                        </div>
                    )}

                    {data && data.content.length === 0 && (
                        <div className="bg-[#13151f] border border-white/5 rounded-xl p-12 text-center">
                            <p className="text-2xl mb-3">◈</p>
                            <p className="text-sm font-medium text-white/60 mb-1">No courses available yet</p>
                            <p className="text-xs text-white/30">Check back soon</p>
                        </div>
                    )}

                    {data && data.content.length > 0 && (
                        <>
                            <p className="text-xs text-white/30 mb-4">{data.totalElements} courses available</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.content.map((course) => {
                                    const thumbnailSrc = course.thumbnailUrl?.startsWith('/')
                                        ? `${backendOrigin}${course.thumbnailUrl}`
                                        : course.thumbnailUrl

                                    return (
                                        <div
                                            key={course.id}
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                            className="bg-[#13151f] border border-white/5 rounded-xl p-5 cursor-pointer hover:border-blue-500/30 hover:bg-white/[0.02] transition-all group"
                                        >
                                            <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center text-3xl overflow-hidden">
                                                {thumbnailSrc ? (
                                                    <img src={thumbnailSrc} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    '◈'
                                                )}
                                            </div>

                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                                                    {course.title}
                                                </h3>
                                                {course.isPremium && (
                                                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                                        PRO
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-white/40 mb-4 line-clamp-2">{course.description}</p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">
                                                    {course.category?.name ?? 'General'}
                                                </span>
                                                <span className="text-sm font-semibold text-white">
                                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
        </AppLayout>
    )
}

export default CoursesPage
