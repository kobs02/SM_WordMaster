import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { CEFRLevel } from "@/lib/types"

interface WordUnitProps {
  level: CEFRLevel
  unitNumber: number
}

export default function WordUnit({ level, unitNumber }: WordUnitProps) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className="h-24 text-lg"
      onClick={() => router.push(`/learn/${level}/unit/${unitNumber}`)}
    >
      Unit {unitNumber}
    </Button>
  )
}
