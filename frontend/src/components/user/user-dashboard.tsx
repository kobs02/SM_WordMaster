import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GamepadIcon as GameController, Calendar, AlertTriangle, Trophy } from "lucide-react"

export default function UserDashboard() {
  const navigate = useNavigate()
  const defaultLevel = "A1" // 추후 user.level 등으로 동적 설정 가능

  const menuItems = [
    {
      title: "단어 학습",
      description: "CEFR 레벨별 단어 학습",
      icon: BookOpen,
      mode: "learn",
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "단어 게임",
      description: "학습한 단어로 게임하기",
      icon: GameController,
      mode: "game",
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
    {
      title: "일일 게임",
      description: "오늘의 단어 도전",
      icon: Calendar,
      path: "/daily-game",
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      title: "오답 노트",
      description: "틀린 단어 복습하기",
      icon: AlertTriangle,
      path: "/wrong-answers",
      color: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-300",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {menuItems.map((item) => (
        <Card key={item.title} className="overflow-hidden border dark:border-gray-700">
          <CardHeader className={`${item.color}`}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <item.icon className={`h-6 w-6 ${item.iconColor}`} />
            </div>
            <CardDescription className="dark:text-gray-300">{item.description}</CardDescription>
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
  )
}
