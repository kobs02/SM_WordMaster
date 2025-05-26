import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";  // useAuth를 임포트
import { ThemeProvider } from "@/lib/theme-context";  // ThemeProvider를 임포트

// 페이지 컴포넌트 임포트
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import LearnPage from "@/pages/learn";
import UnitPage from "@/pages/unit";
import GamePage from "@/pages/game";
import DailyGamePage from "@/pages/daily-game";
import BookmarksPage from "@/pages/bookmarks";
import WrongAnswersPage from "@/pages/wrong-answers";
import RankingsPage from "@/pages/rankings";
import MyPage from "@/pages/mypage";

const App = () => {
  const { user } = useAuth();  // useAuth 훅 사용

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/units/:level" element={<UnitPage />} />
          <Route path="/learn/:level/unit/:unitId" element={<LearnPage />} />
          <Route path="/game/:level/unit/:unitId" element={<GamePage />} />
          <Route path="/game/bookmarked" element={<GamePage />} />
          <Route path="/daily-game" element={<DailyGamePage />} />
          <Route path="/wrong-answers" element={<WrongAnswersPage />} />
          <Route path="/mypage" element={user ? <MyPage /> : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

// AuthProvider로 전체 앱을 감싸고, ThemeProvider도 감싸서 사용하도록 수정
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>
);
