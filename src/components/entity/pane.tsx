import { Edit, FileText, Lock } from "lucide-react"

import { Document } from "@/lib/google"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EntityList } from "@/components/entity/list"

interface Props {
  data: Document | null
  edit: boolean
  onClickEdit: () => void
}

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

export function EntityPane(props: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <DocumentSelect />
        <Button className="shrink-0" onClick={props.onClickEdit}>
          {props.edit ? (
            <Lock className="mr-2 h-4 w-4" />
          ) : (
            <Edit className="mr-2 h-4 w-4" />
          )}
          {props.edit ? "Lock" : "Edit"} fields
        </Button>
      </div>
      <EntityList edit={props.edit} data={props.data} />
    </div>
  )
}
