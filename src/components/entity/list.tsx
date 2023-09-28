import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import { Document } from "@/lib/google"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from "../ui/button"
import { DocumentCompletion } from "./completion"
import { DocumentEntities } from "./entities"

interface Props {
  editable: boolean
  doc: Document | null
  onClickEdit: () => void
}

export function EntityList(props: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

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
      <TabsContent
        value="text"
        className="flex flex-col gap-4 overflow-auto whitespace-pre-wrap font-mono text-sm"
      >
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(props.doc?.text ?? "")
            setCopied(true)
          }}
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy text"}
        </Button>
        {props.doc?.text ?? "No text available"}
      </TabsContent>
    </Tabs>
  )
}
