import { Document } from "@/lib/google"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DocumentCompletion } from "./completion"
import { DocumentEntities } from "./entities"

interface Props {
  editable: boolean
  doc: Document | null
  onClickEdit: () => void
}

export function EntityList(props: Props) {
  return (
    <Tabs defaultValue="entities" className="flex h-full flex-col">
      <TabsList className="mb-2 grid w-full grid-cols-2">
        <TabsTrigger value="entities">Entities</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
      </TabsList>
      <TabsContent value="entities">
        {props.doc?.entities.length ? (
          <DocumentEntities {...props} />
        ) : (
          <DocumentCompletion {...props} />
        )}
      </TabsContent>
      <TabsContent value="text" className="overflow-auto whitespace-pre-wrap">
        {props.doc?.text ?? "No text available"}
      </TabsContent>
    </Tabs>
  )
}
