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
                <Route
                    path="/courses/:courseId/lessons/:lessonId"
                    element={
                        <ProtectedRoute>
                            <LessonPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/quiz"
                    element={
                        <ProtectedRoute>
                            <QuizPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/quiz/result"
                    element={
                        <ProtectedRoute>
                            <QuizResultPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/lessons/:lessonId/quiz"
                    element={
                        <ProtectedRoute>
                            <QuizPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId/lessons/:lessonId/quiz/result"
                    element={
                        <ProtectedRoute>
                            <QuizResultPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute>
                            <ProgressPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/billing"
                    element={
                        <ProtectedRoute>
                            <BillingPage />
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
                        <ProtectedRoute>
                            <QuizzesPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
