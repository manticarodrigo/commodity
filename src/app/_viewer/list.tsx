import { Document } from "@/lib/google"

interface Props {
  data: Document
}

export function EntityList(props: Props) {
  return (
    <ul className="h-full w-96 divide-y overflow-y-auto">
      {props.data.entities
        .slice()
        .sort((a, b) => {
          if (a.type > b.type) return 1
          if (a.type < b.type) return -1
          return 0
        })
        .filter((entity) => entity.mentionText)
        .map((entity) => {
          return (
            <li key={entity.id} className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">
                  {entity.type.split("_").join(" ")}
                </span>{" "}
                {/* <Badge variant="outline">
                  {Math.round(entity.confidence * 100)}%
                </Badge> */}
              </div>
              <div>{entity.mentionText}</div>
            </li>
          )
        })}
    </ul>
  )
}
