import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/layout/header"

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-8 mb-50">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
