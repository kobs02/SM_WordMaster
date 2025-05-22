import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Word } from "@/lib/types"

interface ResultsTableProps {
  words: Word[]
}

export default function ResultsTable({ words }: ResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="dark:border-gray-700">
          <TableHead className="text-center dark:text-gray-300">영단어</TableHead>
          <TableHead className="text-center dark:text-gray-300">의미</TableHead>
          <TableHead className="text-center dark:text-gray-300">레벨</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {words.map((word) => (
          <TableRow key={word.id} className="dark:border-gray-700">
            <TableCell className="text-center font-medium dark:text-gray-300">{word.spelling}</TableCell>
            <TableCell className="text-center dark:text-gray-300">{word.mean}</TableCell>
            <TableCell className="text-center dark:text-gray-300">{word.level}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

