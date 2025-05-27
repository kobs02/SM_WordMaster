import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GamepadIcon as GameController, Calendar, AlertTriangle, Trophy } from "lucide-react"
import {Header} from "@/components/layout/header";

export default function UserDashboard() {
  const navigate = useNavigate()
  const defaultLevel = "A1"


  const menuItems = [
    {
      title: "단어 학습",
      description: "CEFR 레벨별 단어 학습",
      icon: BookOpen,
      mode: "learn",
      color: "bg-blue-200 dark:bg-blue-700",
      iconColor: "text-blue-700 dark:text-white",
      textColor: "text-gray-800 dark:text-white", // 👈 텍스트 컬러
    },
    {
      title: "단어 게임",
      description: "학습한 단어로 게임하기",
      icon: GameController,
      mode: "game",
      color: "bg-green-200 dark:bg-green-700",
      iconColor: "text-green-700 dark:text-white",
      textColor: "text-gray-800 dark:text-white",
    },
    {
      title: "일일 게임",
      description: "오늘의 단어 도전",
      icon: Calendar,
      path: "/daily-game",
      color: "bg-purple-200 dark:bg-purple-700",
      iconColor: "text-purple-700 dark:text-white",
      textColor: "text-gray-800 dark:text-white",
    },
    {
      title: "오답 노트",
      description: "틀린 단어 복습하기",
      icon: AlertTriangle,
      path: "/wrong-answers",
      color: "bg-red-200 dark:bg-red-700",
      iconColor: "text-red-700 dark:text-white",
      textColor: "text-gray-800 dark:text-white",
    },
  ]



  const handleClick = (item: any) => {
    if (item.mode === "learn" || item.mode === "game") {
      // ✅ query string으로 mode 전달
      navigate(`/units/${defaultLevel}?mode=${item.mode}`)
    } else if (item.path) {
      navigate(item.path)
    }
  }
  return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {menuItems.map((item) => (
                <Card
                    key={item.title}
                    className="overflow-hidden border dark:border-gray-700"
                >
                  <CardHeader className={item.color}>
                    <div className="flex justify-between items-center">
                      <CardTitle className={`text-lg ${item.iconColor}`}>
                        {item.title}
                      </CardTitle>
                      <item.icon
                          className={`h-6 w-6 ${item.iconColor}`}
                      />
                    </div>
                    <CardDescription
                        className={`dark:text-gray-300 ${item.textColor}`}
                    >
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-4 bg-card dark:bg-gray-800">
                    <Button
                        variant="outline"
                        className="w-full dark:text-gray-200 dark:border-gray-600"
                        onClick={() => handleClick(item)}
                    >
                      이동하기
                    </Button>
                  </CardFooter>
                </Card>
            ))}
          </div>
        </main>
      </div>
  )
}