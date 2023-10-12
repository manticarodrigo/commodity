"use client"

import { useParams } from "next/navigation"
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
  // const router = useRouter()
  const params = useParams()

  return (
    <Select
      value={params.processorId as string}
      onValueChange={(value) => {
        // router.push(`/processors/${value}`)
      }}
    >
      <SelectTrigger className="w-full lg:w-auto">
        <span className="inline-flex items-center pr-2">
          <FileText className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a processor" />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="929ba35e991edc07">Bill of lading</SelectItem>
          <SelectItem value="13ba0a2985996da3">Contract</SelectItem>
          <SelectItem disabled value="invoice">
            Invoice
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
