import { Document } from "@/lib/google"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Props {
  data: Document
}

export function EntityTable(props: Props) {
  const { data } = props
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Entity</TableHead>
          <TableHead>Text</TableHead>
          <TableHead>Confidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.entities
          .slice()
          .sort((a, b) => {
            if (a.type > b.type) return 1
            if (a.type < b.type) return -1
            return 0
          })
          .filter((entity) => entity.mentionText)
          .map((entity) => {
            return (
              <TableRow key={entity.id} className="px-4 py-2">
                <TableCell>{entity.type}</TableCell>
                <TableCell>{entity.mentionText}</TableCell>
                <TableCell>{Math.round(entity.confidence * 100)}%</TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
