import type React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface GameTypeOption {
  id: "quiz" | "matching"
  title: string
  description: string
  icon: React.ElementType
}

interface GameTypeSelectorProps {
  options: GameTypeOption[]
  selectedType: "quiz" | "matching"
  onSelectType: (type: "quiz" | "matching") => void
}

export function GameTypeSelector({ options, selectedType, onSelectType }: GameTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
      {options.map((option) => (
        <Card
          key={option.id}
          className={`cursor-pointer transition-all ${
            selectedType === option.id ? "ring-2 ring-blue-500 dark:ring-blue-400" : "hover:shadow-md"
          }`}
          onClick={() => onSelectType(option.id)}
        >
          <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-2 md:pb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold">{option.title}</h3>
              <option.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
            <p className="text-xs sm:text-sm">{option.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}