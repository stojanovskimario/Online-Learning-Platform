import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import CoursesPage from '@/pages/CoursesPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import CourseDetailPage from '@/pages/CourseDetailPage'
import MyCoursesPage from '@/pages/MyCoursesPage'
import LessonPage from '@/pages/LessonPage'
import ProgressPage from '@/pages/ProgressPage'
import QuizzesPage from '@/pages/QuizzesPage'
import QuizPage from '@/pages/QuizPage'
import QuizResultPage from '@/pages/QuizResultPage'
import BillingPage from '@/pages/BillingPage'
import CreateCoursePage from './pages/CreateCoursePage'
import CourseEditorPage from '@/pages/CourseEditorPage'
import CertificatesPage from '@/pages/CertificatesPage'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
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
                        <ProtectedRoute allowedRoles={['STUDENT']}>
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
                <Route
                    path="/courses/:courseId/lessons/:lessonId"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <LessonPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/quiz"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <QuizPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/quiz/result"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <QuizResultPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/lessons/:lessonId/quiz"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <QuizPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/lessons/:lessonId/quiz/result"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <QuizResultPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <ProgressPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/billing"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <BillingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/certificates"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <CertificatesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-course"
                    element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <CreateCoursePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/quizzes"
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <QuizzesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:id/edit"
                    element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                            <CourseEditorPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
