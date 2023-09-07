import { Document } from "@/lib/google"
import { Badge } from "@/components/ui/badge"

interface Props {
  data: Document
}

function EntityList(props: Props) {
  return (
    <ul className="h-full w-72 divide-y overflow-y-auto">
      {props.data.entities
        .slice()
        .sort((a, b) => {
          if (a.type > b.type) return 1
          if (a.type < b.type) return -1
          return 0
        })
        .map((entity) => {
          return (
            <li key={entity.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{entity.type}</span>{" "}
                <Badge variant="outline">
                  {Math.round(entity.confidence * 100)}%
                </Badge>
              </div>
              <div>{entity.mentionText}</div>
            </li>
          )
        })}
    </ul>
  )
}

export default EntityList
