import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LevelTabsProps {
  currentLevel: string
  onLevelChange: (level: string) => void
}

export function LevelTabs({ currentLevel, onLevelChange }: LevelTabsProps) {
  return (
    <Tabs defaultValue={currentLevel} onValueChange={onLevelChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="A" className="text-xs sm:text-sm">
          초급 (A)
        </TabsTrigger>
        <TabsTrigger value="B" className="text-xs sm:text-sm">
          중급 (B)
        </TabsTrigger>
        <TabsTrigger value="C" className="text-xs sm:text-sm">
          고급 (C)
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
