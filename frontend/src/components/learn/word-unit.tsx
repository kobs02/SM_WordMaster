import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import type { CEFRLevel } from "@/lib/types"

interface WordUnitProps {
  level: CEFRLevel
  unitNumber: number
}

export default function WordUnit({ level, unitNumber }: WordUnitProps) {
  const router = useNavigate();

  return (
    <Button
      variant="outline"
      className="h-24 text-lg"
      onClick={() => router(`/learn/${level}/unit/${unitNumber}`)}
    >
      Unit {unitNumber}
    </Button>
  )
}
