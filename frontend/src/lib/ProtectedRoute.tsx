// src/lib/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";

export function RequireAuth() {
    const { user, isLoading } = useAuth();
    if (isLoading) return null; // 또는 <Spinner />
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;
    // ADMIN이 아니면 USER 대시보드로
    if (user.role !== Role.ADMIN)
        return <Navigate to="/user-dashboard" replace />;
    return <>{children}</>;
}

export function UserRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;
    // ADMIN은 관리자 대시보드로
    if (user.role === Role.ADMIN)
        return <Navigate to="/admin-dashboard" replace />;
    return <>{children}</>;
}
