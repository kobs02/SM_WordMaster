import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import type { CEFRLevel } from "@/lib/types"

const MAX_UNIT = 5

export default function UnitPage() {
  const navigate = useNavigate()
  const { level: defaultLevel } = useParams<{ level: string }>()
  const [searchParams] = useSearchParams()
  const mode = (searchParams.get("mode") as "learn" | "game") || "learn"

  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>((defaultLevel as CEFRLevel) || "A1")

  const handleSelect = (unitId: number) => {
    if (mode === "learn") {
      navigate(`/learn/${selectedLevel}/unit/${unitId}`)
    } else {
      navigate(`/game/${selectedLevel}/unit/${unitId}`)
    }
  }

  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {mode === "learn" ? "단어 학습" : "단어 게임"} - 레벨 및 유닛 선택
        </h1>

        <Tabs defaultValue={selectedLevel} onValueChange={(v) => setSelectedLevel(v as CEFRLevel)}>
          <TabsList className="grid grid-cols-6 mb-8">
            {levels.map((lvl) => (
              <TabsTrigger key={lvl} value={lvl}>
                {lvl}
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map((lvl) => (
            <TabsContent key={lvl} value={lvl} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{lvl} 레벨 유닛</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: MAX_UNIT }, (_, i) => i + 1).map((unitId) => (
                  <Button
                    key={unitId}
                    variant="outline"
                    className="h-20 text-lg"
                    onClick={() => handleSelect(unitId)}
                  >
                    Unit {unitId} {mode === "learn" ? "학습" : "게임"}
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
