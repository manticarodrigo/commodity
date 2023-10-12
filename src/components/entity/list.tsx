import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Check, Copy, ShieldAlert } from "lucide-react"

import { Document } from "@/lib/google"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { DocumentCompletion } from "./completion"

interface Props {
  editable: boolean
  doc: Document | null
  onClickEdit: () => void
}

const revisionMap: Record<string, React.ReactNode> = {
  clnnhvwll0002yfw3fhav08a6: (
    <>
      <Badge variant="destructive" className="mb-2">
        <ShieldAlert className="mr-2 h-4 w-4" />
        Unaccounted costs
      </Badge>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>ITAS Comparison</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Invoice listed charge: $239.69</TableCell>
            <TableCell>No cost accounted for</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="p-2 text-muted-foreground">
        There is a discrepancy between the invoice charge amount and ITAS.
        Please review the invoice and ITAS to correct the charge amount.
      </p>
    </>
  ),
  clnnhvgev0001yfw30hfnv07q: (
    <div className="prose dark:prose-invert">
      <Badge variant="destructive" className="mb-2">
        <ShieldAlert className="mr-2 h-4 w-4" />
        Risks identified
      </Badge>
      <p>
        <strong>Import License Obligation</strong>: The responsibility of
        securing and maintaining any required import license lies with the Buyer
      </p>
      <p>
        <strong>Port Congestion in the Port of Acajutla</strong>: The shipment
        window is relatively stringent, given recent port congestion in the Port
        of Acajutla, this may be difficult for the seller to fulfill the
        obligations of the contracts.
      </p>
    </div>
  ),
}

export function EntityList(props: Props) {
  const { documentId: id } = useParams()
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
    <Tabs defaultValue="summary" className="flex h-full flex-col">
      <TabsList className="mb-2 grid w-full grid-cols-3">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="entities">Entities</TabsTrigger>
        <TabsTrigger value="revision">Revision</TabsTrigger>
        {/* <TabsTrigger value="text">Text</TabsTrigger> */}
      </TabsList>
      <TabsContent value="summary">
        <DocumentCompletion
          {...props}
          prompt={`
            You are a state of the art commodity trading document processor. Take the appended document text and follow the instructions below.
        
            Summarize the document contents in a few sentences.
        
            Call out any important entities you recognize in the text.

            The text is appended below:
            ${props.doc?.text ?? ""}
          `}
        />
      </TabsContent>
      <TabsContent value="entities">
        <DocumentCompletion
          {...props}
          prompt={`
            You are a state of the art commodity trading document processor. Take the appended document text and follow the instructions below.
        
            List out each entity you recognize in the text.
        
            Provide your answer as a simple markdown list with a title and a description or value like so:

            **Seller**
            Acme Inc.

            **Buyer**
            Widget Corp.

            **Force Majeure**
            The fulfillment of this contract adheres to the force majeure rules of the Refined Sugar Association.

            The text is appended below:
            ${props.doc?.text ?? ""}
          `}
        />
      </TabsContent>
      <TabsContent value="revision">
        {revisionMap[id as string] ?? (
          <p>No revisions available for this document. </p>
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
