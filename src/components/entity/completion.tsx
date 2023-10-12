import { useState } from "react"
import { useCompletion } from "ai/react"
import { Download, Edit, Lock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import TextareaAutosize from "react-textarea-autosize"

import { useEffectOnce } from "@/hooks/use-effect-once"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
  prompt: string
  editable: boolean
  onClickEdit: () => void
}

export function DocumentCompletion(props: Props) {
  const [text, setText] = useState("")
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/chat",
  })

  useEffectOnce(() => {
    if (props.prompt && !isLoading) {
      complete(props.prompt).then((res) => {
        setText(res ?? "")
      })
    }
  })

  const exportTxt = () => {
    const element = document.createElement("a")
    const file = new Blob([completion], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "completion.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="grid w-full grid-cols-2 gap-2">
          <Button
            className="shrink-0"
            variant="secondary"
            onClick={props.onClickEdit}
          >
            {props.editable ? (
              <Lock className="mr-2 h-4 w-4" />
            ) : (
              <Edit className="mr-2 h-4 w-4" />
            )}
            {props.editable ? "Lock" : "Edit"} text
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="shrink-0" variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={exportTxt}>TXT</DropdownMenuItem>
                <DropdownMenuItem disabled>Excel</DropdownMenuItem>
                <DropdownMenuItem disabled>PDF</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="flex grow flex-col rounded-lg p-4">
        {props.editable ? (
          <TextareaAutosize
            value={text}
            className="grow resize-none bg-transparent outline-none"
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <ReactMarkdown className="prose prose-sm whitespace-pre-line dark:prose-invert prose-p:my-0">
            {text || completion}
          </ReactMarkdown>
        )}
      </Card>
    </div>
  )
}
