import { Document } from "@/lib/google"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DocumentChat } from "./chat"
import { DocumentEntities } from "./entities"

interface Props {
  editable: boolean
  doc: Document | null
  onClickEdit: () => void
}

export function EntityList(props: Props) {
  return (
    <Tabs defaultValue="entities" className="flex h-full flex-col">
      <TabsList className="mb-2 grid w-full grid-cols-3">
        <TabsTrigger value="entities">Entities</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
      </TabsList>
      <TabsContent value="entities">
        <DocumentEntities {...props} />
      </TabsContent>
      <TabsContent value="chat" className="flex grow flex-col">
        <DocumentChat doc={props.doc} />
      </TabsContent>
      <TabsContent value="text" className="overflow-auto whitespace-pre-wrap">
        {props.doc?.text ?? "No text available"}
      </TabsContent>
    </Tabs>
  )
}
