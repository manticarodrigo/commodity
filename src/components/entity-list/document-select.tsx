import { FileText } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DocumentSelect() {
  return (
    <Select value="bol">
      <SelectTrigger className="w-full min-w-0">
        <span className="inline-flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a document processor" />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="bol">Bill of lading</SelectItem>
          <SelectItem disabled value="contract">
            Contract
          </SelectItem>
          <SelectItem disabled value="invoice">
            Invoice
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
