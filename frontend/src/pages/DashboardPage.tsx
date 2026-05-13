import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const DashboardPage = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Learnix</h1>
                    <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.firstName} {user?.lastName}
            </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {user?.role}
            </span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.firstName}!
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {user?.subscriptionTier === 'FREE'
                            ? 'Free plan — upgrade to access all courses'
                            : 'Premium plan — enjoy full access'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <p className="text-sm text-gray-500 mb-1">My Courses</p>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <p className="text-sm text-gray-500 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <p className="text-sm text-gray-500 mb-1">Certificates</p>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        You're not enrolled in any courses yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Browse the catalogue and start learning today
                    </p>
                    <Button onClick={() => navigate('/courses')}>
                        Browse Courses
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default DashboardPage