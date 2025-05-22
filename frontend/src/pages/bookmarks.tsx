import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bookmark } from "lucide-react"
import { mockWords } from "@/lib/mock-data"

export default function BookmarksPage() {
  const navigate = useNavigate()
  const [bookmarkedWords, setBookmarkedWords] = useState(mockWords.filter((word) => word.bookmarked))
  const [selectedWords, setSelectedWords] = useState<string[]>([])

  const handleSelectAll = () => {
    if (selectedWords.length === bookmarkedWords.length) {
      setSelectedWords([])
    } else {
      setSelectedWords(bookmarkedWords.map((word) => word.id))
    }
  }

  const handleSelect = (wordId: string) => {
    if (selectedWords.includes(wordId)) {
      setSelectedWords(selectedWords.filter((id) => id !== wordId))
    } else {
      setSelectedWords([...selectedWords, wordId])
    }
  }

  const handleRemoveBookmark = (wordId: string) => {
    setBookmarkedWords(bookmarkedWords.filter((word) => word.id !== wordId))
  }

  const handleStartGame = () => {
    if (selectedWords.length > 0) {
      // 실제 구현에서는 선택된 단어로 게임을 시작하는 로직
      navigate("/game/bookmarked")
    }
  }
}
