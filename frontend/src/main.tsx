import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import LearnPage from "@/pages/learn";
import UnitPage from "@/pages/unit";
import GamePage from "@/pages/game";
import DailyGamePage from "@/pages/daily-game";
import WrongAnswersPage from "@/pages/wrong-answers";
import MyPage from "@/pages/mypage";
import UserDashboard from "@/components/user/user-dashboard"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { RequireAuth, AdminRoute, UserRoute } from "@/lib/ProtectedRoute"
import {Role} from "@/lib/types";

function HomeRedirect() {
    const { user, isLoading } = useAuth();
    if (isLoading) return null;
    if (user) {
        return <Navigate to={ user.role === Role.ADMIN ? "/admin-dashboard" : "/user-dashboard" } replace />;
    }
    return <HomePage />;
}

const App = () => (
    <BrowserRouter>
        <Routes>
            {/* 1) 모두 접근 가능한 라우트 */}
            <Route path="/" element={<HomeRedirect  />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 2) 로그인 필요 */}
            <Route element={<RequireAuth />}>
                {/* 역할별 대시보드 */}
                <Route
                    path="/user-dashboard"
                    element={
                        <UserRoute>
                            <UserDashboard />
                        </UserRoute>
                    }
                />
                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* 나머지 기능 페이지들 */}
                <Route path="/units/:level" element={<UnitPage />} />
                <Route path="/learn/:level/unit/:unitId" element={<LearnPage />} />
                <Route path="/game/:level/unit/:unitId" element={<GamePage />} />
                <Route path="/game/bookmarked" element={<GamePage />} />
                <Route path="/daily-game" element={<DailyGamePage />} />
                <Route path="/wrong-answers" element={<WrongAnswersPage />} />
                <Route path="/mypage" element={<MyPage />} />
            </Route>

            {/* 3) 그 외는 홈으로 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
)
// AuthProvider로 전체 앱을 감싸고, ThemeProvider도 감싸서 사용하도록 수정
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>
);


