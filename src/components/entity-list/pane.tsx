import { Edit, Lock } from "lucide-react"

import { Document } from "@/lib/google"

import { Button } from "@/components/ui/button"
import { DocumentSelect } from "@/components/entity-list/document-select"
import { EntityList } from "@/components/entity-list/list"

interface Props {
  data: Document
  edit: boolean
  onClickEdit: () => void
}

export function EntityListPane(props: Props) {
  return (
    <>
      <div className="mb-2 flex gap-2">
        <DocumentSelect />
        <Button
          variant="secondary"
          className="shrink-0"
          onClick={props.onClickEdit}
        >
          {props.edit ? (
            <Lock className="mr-2 h-4 w-4" />
          ) : (
            <Edit className="mr-2 h-4 w-4" />
          )}
          {props.edit ? "Lock" : "Edit"} fields
        </Button>
      </div>
      <EntityList edit={props.edit} data={props.data} />
    </>
  )
}
