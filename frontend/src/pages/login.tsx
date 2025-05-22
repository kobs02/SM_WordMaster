import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 mb-50">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}