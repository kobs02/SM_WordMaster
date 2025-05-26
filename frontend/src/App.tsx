import React, {JSX, useContext} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import AdminDashBoard from '@/pages/AdminDashBoard'
import { AuthProvider, AuthContext } from '@/context/AuthContext'
import NotFoundPage from "@/pages/notFound";

function RequireAuth({ children }: { children: JSX.Element }) {
    const { user, loading } = useContext(AuthContext)
    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" replace />
    return children
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/admin-dashboard"
                        element={
                            <RequireAuth>
                                <AdminDashBoard />
                            </RequireAuth>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
