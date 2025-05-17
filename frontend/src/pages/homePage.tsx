import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { Role } from "@/lib/types";
import "./HomePage.css";
import AdminPage from "@/pages/admin/adminPage.tsx";
import UserPage from "@/pages/users/userPage.tsx";  // CSS 파일 추가

export default function HomePage() {
    const { user, logout } = useAuth();

    return (
        <div className="home-container">
            <Header />

            <main className="main-content">
                {user ? (
                    <div className="user-dashboard">
                        {user.role === Role.ADMIN ? (
                            <AdminPage />
                        ) : (
                            <UserPage />
                        )}

                        <Button onClick={logout} className="logout-button">
                            로그아웃
                        </Button>
                    </div>
                ) : (
                    <div className="welcome-message">
                        <h1 className="title">
                            영어 단어 학습을 <span className="highlight">지금</span> 시작하세요
                        </h1>
                        <p className="description">
                            CEFR 기준에 따른 체계적인 커리큘럼과 게임 기반 학습을 통해 재미있고 효과적으로 단어를 익히세요.
                        </p>

                        <div className="action-buttons">
                            <Link to="/login">
                                <Button className="login-button">
                                    로그인
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="register-button">
                                    회원가입
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <footer className="footer">
                © 2025 WordMaster. All rights reserved.
            </footer>
        </div>
    );
}
