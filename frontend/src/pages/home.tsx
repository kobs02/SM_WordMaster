import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import AdminDashboard from "@/components/admin/admin-dashboard";
import UserDashboard from "@/components/user/user-dashboard";
import { Header } from "@/components/layout/header";
import { Role } from "@/lib/types";

export default function HomePage() {
  const { user, isLoading } = useAuth(); // ✅ isLoading 추가

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-300">불러오는 중..</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow max-w-screen-xl flex items-center justify-center mb-50">
        {user ? (
          <div className="w-full text-center">
            {user.role === Role.ADMIN ? <AdminDashboard /> : <UserDashboard />}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">영어 단어 학습을 시작하세요</h2>
            <p className="text-muted-foreground dark:text-gray-400 mb-6">
              CEFR 기준에 따른 체계적인 학습과 게임화된 학습 경험을 제공합니다.
            </p>
            <Link to="/login">
              <Button type="button" size="lg" className="dark:bg-blue-700 dark:hover:bg-blue-600">
                로그인해주세요
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

