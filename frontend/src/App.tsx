import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import CoursesPage from '@/pages/CoursesPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import CourseDetailPage from '@/pages/CourseDetailPage'
import MyCoursesPage from '@/pages/MyCoursesPage'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute>
                            <CoursesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/my"
                    element={
                        <ProtectedRoute>
                            <MyCoursesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:id"
                    element={
                        <ProtectedRoute>
                            <CourseDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
