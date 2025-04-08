import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Link to="/">
          <button className="h-8 w-8 sm:h-10 sm:w-10 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Back to home</span>
          </button>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">도움말</h1>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-2 md:pb-3 border-b dark:border-gray-700">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">College Vocabulary Builder 소개</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                대학생을 위한 영어 단어 학습 애플리케이션
              </p>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-2 sm:space-y-4 text-xs sm:text-sm">
              <p>
                College Vocabulary Builder는 대학생들이 효과적으로 영어 단어를 학습할 수 있도록 설계된
                애플리케이션입니다. 다양한 레벨의 단어를 제공하며, 암기와 게임을 통해 재미있게 학습할 수 있습니다.
              </p>
              <p>주요 기능:</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2">
                <li>레벨별 단어 학습 (A, B, C 레벨)</li>
                <li>레벨 테스트를 통한 자신의 수준 파악</li>
                <li>효과적인 단어 암기 기능</li>
                <li>게임을 통한 재미있는 학습</li>
                <li>관리자 기능을 통한 단어 관리</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-2 md:pb-3 border-b dark:border-gray-700">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">시작하기</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                College Vocabulary Builder 사용 방법
              </p>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-2 sm:space-y-4 text-xs sm:text-sm">
              <p>
                1. <strong>계정 생성:</strong> 우측 상단의 '로그인/회원가입' 버튼을 클릭하여 계정을 만드세요.
              </p>
              <p>
                2. <strong>레벨 테스트:</strong> 자신의 영어 단어 수준을 모른다면, 레벨 테스트를 통해 확인해보세요.
              </p>
              <p>
                3. <strong>레벨 선택:</strong> 적절한 레벨(A, B, C)을 선택하여 학습을 시작하세요.
              </p>
              <p>
                4. <strong>단어 암기:</strong> 단어 암기 페이지에서 체계적으로 단어를 학습하세요.
              </p>
              <p>
                5. <strong>게임으로 학습:</strong> 게임을 통해 재미있게 단어를 복습하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}